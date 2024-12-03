import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Stock } from './domain/stock.entity';
import {
  StockDaily,
  StockMinutely,
  StockMonthly,
  StockWeekly,
  StockYearly,
} from './domain/stockData.entity';
import {
  PriceDto,
  StockDataResponse,
  VolumeDto,
} from './dto/stockData.response';
import { StockDataCache } from '@/stock/cache/stockData.cache';
import { getFormattedDate } from '@/utils/date';

type StockData = {
  id: number;
  close: number;
  low: number;
  high: number;
  open: number;
  volume: number;
  startTime: Date;
  stock: Stock;
  createdAt: Date;
};

@Injectable()
export class StockDataService {
  protected readonly PAGE_SIZE = 100;

  constructor(
    private readonly dataSource: DataSource,
    private readonly stockDataCache: StockDataCache,
  ) {}

  async getPaginated(
    entity: new () => StockData,
    stockId: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.dataSource.manager.transaction(async (manager) => {
      if (!(await this.isStockExist(stockId, manager)))
        throw new NotFoundException('stock not found');
      const cacheKey = this.createCacheKey(entity, stockId, lastStartTime);
      const cachedData = this.stockDataCache.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      const queryBuilder = this.createQueryBuilder(
        entity,
        stockId,
        manager,
        lastStartTime,
      );
      const results = await queryBuilder.getMany();
      const response = this.convertResultsToResponse(results);
      this.stockDataCache.set(cacheKey, response);
      return response;
    });
  }

  async isStockExist(stockId: string, manager: EntityManager) {
    return await manager.exists(Stock, { where: { id: stockId } });
  }

  private createCacheKey(
    entity: new () => StockData,
    stockId: string,
    lastStartTime?: string,
  ) {
    const date = lastStartTime ? new Date(lastStartTime) : new Date();
    return `${entity.name}_${stockId}_${getFormattedDate(date)}`;
  }

  private convertResultsToResponse(results: StockData[]) {
    const hasMore = results.length > this.PAGE_SIZE;
    if (hasMore) results.pop();
    const prices = this.convertResultsToPriceDtoList(results);
    const volumes = this.convertResultsToVolumeDtoList(results);
    return new StockDataResponse(prices, volumes, hasMore);
  }

  private createQueryBuilder(
    entity: new () => StockData,
    stock_id: string,
    manager: EntityManager,
    lastStartTime?: string,
  ) {
    const queryBuilder = manager
      .createQueryBuilder(entity, 'entity')
      .where('entity.stock_id = :stockId', { stockId: stock_id })
      .orderBy('entity.startTime', 'DESC')
      .take(this.PAGE_SIZE + 1);

    if (lastStartTime)
      queryBuilder.andWhere('entity.startTime < :lastStartTime', {
        lastStartTime: lastStartTime,
      });
    return queryBuilder;
  }

  private convertResultsToPriceDtoList(resultList: StockData[]): PriceDto[] {
    return resultList
      .reduce((acc: PriceDto[], stockData) => {
        if (!stockData) return acc;
        acc.push(new PriceDto(stockData));
        return acc;
      }, [])
      .reverse();
  }

  private convertResultsToVolumeDtoList(resultList: StockData[]): VolumeDto[] {
    return resultList
      .reduce((acc: VolumeDto[], stockData) => {
        if (!stockData) return acc;
        acc.push(new VolumeDto(stockData));
        return acc;
      }, [])
      .reverse();
  }
}

@Injectable()
export class StockDataMinutelyService extends StockDataService {
  constructor(dataSource: DataSource, stockDataCache: StockDataCache) {
    super(dataSource, stockDataCache);
  }
  async getStockDataMinutely(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.getPaginated(StockMinutely, stock_id, lastStartTime);
  }
}

@Injectable()
export class StockDataDailyService extends StockDataService {
  constructor(dataSource: DataSource, stockDataCache: StockDataCache) {
    super(dataSource, stockDataCache);
  }
  async getStockDataDaily(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.getPaginated(StockDaily, stock_id, lastStartTime);
  }
}

@Injectable()
export class StockDataWeeklyService extends StockDataService {
  constructor(dataSource: DataSource, sockDataCache: StockDataCache) {
    super(dataSource, sockDataCache);
  }
  async getStockDataWeekly(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.getPaginated(StockWeekly, stock_id, lastStartTime);
  }
}

@Injectable()
export class StockDataMonthlyService extends StockDataService {
  constructor(dataSource: DataSource, stockDataCache: StockDataCache) {
    super(dataSource, stockDataCache);
  }
  async getStockDataMonthly(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.getPaginated(StockMonthly, stock_id, lastStartTime);
  }
}

@Injectable()
export class StockDataYearlyService extends StockDataService {
  constructor(dataSource: DataSource, stockDataCache: StockDataCache) {
    super(dataSource, stockDataCache);
  }
  async getStockDataYearly(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.getPaginated(StockYearly, stock_id, lastStartTime);
  }
}
