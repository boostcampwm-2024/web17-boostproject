import { Inject, Injectable } from '@nestjs/common';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
  DataSource,
} from 'typeorm';
import { Logger } from 'winston';
import { StockLiveData } from './domain/stockLiveData.entity';
import { StockGateway } from './stock.gateway';

@Injectable()
@EventSubscriber()
export class StockLiveDataSubscriber
  implements EntitySubscriberInterface<StockLiveData>
{
  constructor(
    private readonly datasource: DataSource,
    private readonly stockGateway: StockGateway,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.datasource.subscribers.push(this);
  }

  listenTo() {
    return StockLiveData;
  }

  async afterInsert(event: InsertEvent<StockLiveData>) {
    try {
      const entity = event.entity;
      const { id: stockId } = entity.stock;
      const {
        currentPrice: price,
        changeRate: change,
        volume: volume,
      } = entity;

      this.stockGateway.onUpdateStock(stockId, price, change, volume);
    } catch (error) {
      this.logger.warn(`Failed to handle afterInsert event : ${error}`);
    }
  }

  async afterUpdate(event: UpdateEvent<StockLiveData>) {
    try {
      const updatedStockLiveData =
        event.entity || (await this.loadUpdatedData(event));

      if (updatedStockLiveData?.stock?.id) {
        const { id: stockId } = updatedStockLiveData.stock;
        const {
          currentPrice: price,
          changeRate: change,
          volume: volume,
        } = updatedStockLiveData;
        this.stockGateway.onUpdateStock(stockId, price, change, volume);
      } else {
        this.logger.warn(
          `Stock ID missing for updated data : ${updatedStockLiveData?.id}`,
        );
      }
    } catch (error) {
      this.logger.warn(`Failed to handle afterUpdate event : ${error}`);
    }
  }

  private async loadUpdatedData(event: UpdateEvent<StockLiveData>) {
    return event.manager.findOne(StockLiveData, {
      where: { id: event.databaseEntity.id },
    });
  }
}
