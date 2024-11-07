import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Stock } from './domain/stock.entity';
import { UserStock } from '@/stock/domain/userStock.entity';

@Injectable()
export class StockService {
  constructor(private readonly datasource: DataSource) {}

  async increaseView(stockId: string) {
    await this.datasource.transaction(async (manager) => {
      const isExists = await manager.exists(Stock, { where: { id: stockId } });
      if (!isExists) {
        throw new BadRequestException('stock not found');
      }
      return await manager.increment(Stock, { id: stockId }, 'views', 1);
    });
  }

  // 유저 존재는 인증에서 확인가능해서 생략
  async createUserStock(userId: number, stockId: string) {
    await this.datasource.transaction(async (manager) => {
      await this.validateStockExists(stockId, manager);
      await this.validateDuplicateUserStock(stockId, userId, manager);
      await manager.insert(UserStock, {
        user: { id: userId },
        stock: { id: stockId },
      });
    });
  }

  private async validateStockExists(stockId: string, manager: EntityManager) {
    if (!(await this.existsStock(stockId, manager))) {
      throw new BadRequestException('not exists stock');
    }
  }

  private async validateDuplicateUserStock(
    stockId: string,
    userId: number,
    manager: EntityManager,
  ) {
    if (await this.existsUserStock(userId, stockId, manager)) {
      throw new BadRequestException('user stock already exists');
    }
  }

  private async existsUserStock(
    userId: number,
    stockId: string,
    manager: EntityManager,
  ) {
    return await manager.exists(UserStock, {
      where: {
        user: { id: userId },
        stock: { id: stockId },
      },
    });
  }

  private async existsStock(stockId: string, manager: EntityManager) {
    return await manager.exists(Stock, { where: { id: stockId } });
  }
}
