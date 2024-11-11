import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { Stock } from './domain/stock.entity';
import { UserStock } from '@/stock/domain/userStock.entity';

@Injectable()
export class StockService {
  constructor(
    private readonly datasource: DataSource,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async increaseView(stockId: string) {
    await this.datasource.transaction(async (manager) => {
      const isExists = await manager.exists(Stock, { where: { id: stockId } });
      if (!isExists) {
        this.logger.warn(`stock not found: ${stockId}`);
        throw new BadRequestException('stock not found');
      }
      return await manager.increment(Stock, { id: stockId }, 'views', 1);
    });
  }

  // 유저 존재는 인증에서 확인가능해서 생략
  async createUserStock(userId: number, stockId: string) {
    return await this.datasource.transaction(async (manager) => {
      await this.validateStockExists(stockId, manager);
      await this.validateDuplicateUserStock(stockId, userId, manager);
      return await manager.insert(UserStock, {
        user: { id: userId },
        stock: { id: stockId },
      });
    });
  }

  async deleteUserStock(userId: number, userStockId: number) {
    await this.datasource.transaction(async (manager) => {
      const userStock = await manager.findOne(UserStock, {
        where: { id: userStockId },
        relations: ['user'],
      });
      this.validateUserStock(userId, userStock);
      await manager.delete(UserStock, {
        id: userStockId,
      });
    });
  }

  validateUserStock(userId: number, userStock: UserStock | null) {
    if (!userStock) {
      throw new BadRequestException('user stock not found');
    }
    if (!userStock.user) {
      throw new Error('Invalid user stock row');
    }
    if (userStock.user.id !== userId) {
      throw new BadRequestException('you are not owner of user stock');
    }
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
