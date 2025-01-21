import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Logger } from 'winston';
import {
  StockRankResponses,
  StockSearchResponse,
  StocksResponse,
} from './dto/stock.response';
import { UserStock } from '@/stock/domain/userStock.entity';
import { UserStocksResponse } from '@/stock/dto/userStock.response';
import { StockRepository } from '@/stock/repository/stock.repository';
import { UserStockRepository } from '@/stock/repository/userStock.repository';

@Injectable()
export class StockService {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly userStockRepository: UserStockRepository,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async increaseView(stockId: string) {
    const isExists = await this.stockRepository.existsById(stockId);
    if (!isExists) {
      this.logger.warn(`stock not found: ${stockId}`);
      throw new BadRequestException('stock not found');
    }
    return this.stockRepository.increaseView(stockId);
  }

  checkStockExist(stockId: string) {
    return this.stockRepository.existsById(stockId);
  }

  async searchStock(stockName: string) {
    const result = await this.stockRepository.findByName(stockName);
    return new StockSearchResponse(result);
  }

  async getTopStocks(sortBy: string, limit: number) {
    switch (sortBy) {
      case 'views':
        return this.getTopStocksByViews(limit);
      case 'gainers':
        return this.getTopStocksByGainers(limit);
      case 'losers':
        return this.getTopStocksByLosers(limit);
      default:
        throw new BadRequestException(`Unknown sort strategy: ${sortBy}`);
    }
  }

  async getTopStocksByViews(limit: number) {
    const rawData = await this.stockRepository.findByTopViews(limit);
    return plainToInstance(StocksResponse, rawData);
  }

  async getTopStocksByGainers(limit: number) {
    const rawData = await this.stockRepository.findByTopGainers(limit);
    return new StockRankResponses(rawData);
  }

  async getTopStocksByLosers(limit: number) {
    const rawData = await this.stockRepository.findByTopLosers(limit);
    return new StockRankResponses(rawData);
  }

  // TODO: 프론트엔드에서 'fluctuation' api 경로에 대한 요청을 삭제하면서 이 메서드는 더 이상 사용되지 않음
  // 현재 이 메서드는 fluctuation 기준 상승 상위 20개와 하락 상위 20개를 함께 반환하는 용도 이외에 의의는 없음
  async getTopStocksByFluctuation() {
    const data = await this.stockRepository.findAllWithFluctuaions();
    return new StockRankResponses(data);
  }

  private async validateStockExists(stockId: string) {
    if (!(await this.stockRepository.existsById(stockId))) {
      throw new BadRequestException('not exists stock');
    }
  }

  async createUserStock(userId: number, stockId: string) {
    await this.validateStockExists(stockId);
    await this.validateDuplicateUserStock(stockId, userId);
    return this.userStockRepository.create(userId, stockId);
  }
  
  async isUserStockOwner(stockId: string, userId?: number) {
    if (!userId) {
      return false;
    }
    return this.userStockRepository.exists(userId, stockId);
  }

  async getUserStocks(userId?: number) {
    if (!userId) {
      return new UserStocksResponse([]);
    }
    const result = await this.userStockRepository.findByUserIdWithStock(userId);
    return new UserStocksResponse(result);
  }

  async deleteUserStock(userId: number, stockId: string) {
    const userStock = await this.userStockRepository.findByUserIdAndStockId(
      userId,
      stockId,
    );
    this.validateUserStock(userId, userStock);
    await this.userStockRepository.delete(userStock!.id);
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

  private async validateDuplicateUserStock(stockId: string, userId: number) {
    if (await this.userStockRepository.exists(userId, stockId)) {
      throw new BadRequestException('user stock already exists');
    }
  }
}
