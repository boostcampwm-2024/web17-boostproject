import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { StockDetail } from './domain/stockDetail.entity';
import { StockDetailResponse } from './dto/stockDetail.response';

@Injectable()
export class StockDetailService {
  constructor(
    private readonly datasource: DataSource,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async getStockDetailByStockId(stockId: string): Promise<StockDetailResponse> {
    return await this.datasource.transaction(async (manager) => {
      const isExists = await manager.existsBy(StockDetail, {
        stock: { id: stockId },
      });

      if (!isExists) {
        this.logger.warn(`stock detail not found (stockId: ${stockId})`);
        throw new NotFoundException(
          `stock detail not found (stockId: ${stockId}`,
        );
      }

      const result = await manager
        .getRepository(StockDetail)
        .createQueryBuilder('stockDetail')
        .leftJoinAndSelect('stockDetail.stock', 'stock')
        .where('stockDetail.stock_id = :stockId', { stockId })
        .getOne();

      if (!result) {
        throw new NotFoundException(
          `stock detail not found (stockId: ${stockId}`,
        );
      }

      return new StockDetailResponse(result);
    });
  }
}
