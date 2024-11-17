import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource, EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { Stock } from './domain/stock.entity';
import { StocksResponse } from './dto/stock.Response';
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

  async checkStockExist(stockId: string) {
    return await this.datasource.manager.exists(Stock, {
      where: { id: stockId },
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

  private StocksQuery() {
    return this.datasource
      .getRepository(Stock)
      .createQueryBuilder('stock')
      .leftJoin(
        'stock_live_data',
        'stockLiveData',
        'stock.id = stockLiveData.stock_id',
      )
      .leftJoin(
        'stock_detail',
        'stockDetail',
        'stock.id = stockDetail.stock_id',
      )
      .select([
        'stock.id AS id',
        'stock.name AS name',
        'stockLiveData.currentPrice AS currentPrice',
        'stockLiveData.changeRate AS changeRate',
        'stockLiveData.volume AS volume',
        'stockDetail.marketCap AS marketCap',
      ]);
  }

  async getTopStocksByViews(limit: number) {
    const rawData = await this.StocksQuery()
      .orderBy('stock.views', 'DESC')
      .limit(limit)
      .getRawMany();

    return plainToInstance(StocksResponse, rawData);
  }
}
