import { Inject } from '@nestjs/common';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
} from 'typeorm';
import { Logger } from 'winston';
import { StockLiveData } from './domain/stockLiveData.entity';
import { StockGateway } from './stock.gateway';

@EventSubscriber()
export class StockLiveDataSubscriber
  implements EntitySubscriberInterface<StockLiveData>
{
  constructor(
    private readonly stockGateway: StockGateway,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  listenTo() {
    return StockLiveData;
  }

  async afterUpdate(event: UpdateEvent<StockLiveData>) {
    try {
      const updatedStockLiveData =
        event.entity || (await this.loadUpdatedData(event));

      if (updatedStockLiveData?.stock?.id) {
        const { id: stockId } = updatedStockLiveData.stock;
        const {
          current_price: price,
          change_rate: change,
          volume: volume,
        } = updatedStockLiveData;
        this.stockGateway.onUpdateStock(stockId, price, change, volume);
      } else {
        this.logger.error(
          `Stock ID missing for updated data : ${updatedStockLiveData?.id}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to handle afterUpdate event : ${error}`);
    }
  }

  private async loadUpdatedData(event: UpdateEvent<StockLiveData>) {
    return event.manager.findOne(StockLiveData, {
      where: { id: event.databaseEntity.id },
    });
  }
}
