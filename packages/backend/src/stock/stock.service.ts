import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Stock } from './domain/stock.entity';

@Injectable()
export class StockService {
  constructor(private readonly datasource: DataSource) {}

  async increaseView(stockId: string) {
    await this.datasource.transaction(async (manager) => {
      const isExists = await manager.exists(Stock, { where: { id: stockId } });
      if (!isExists) {
        throw new NotFoundException('stock not found');
      }
      return await manager.increment(Stock, { id: stockId }, 'views', 1);
    });
  }
}
