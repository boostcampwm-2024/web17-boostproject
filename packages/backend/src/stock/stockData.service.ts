import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
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
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.dataSource.manager.transaction(async (manager) => {
      if (!(await this.isStockExist(stock_id, manager)))
        throw new NotFoundException('stock not found');
      const date = lastStartTime ? new Date(lastStartTime) : new Date();
      const cacheKey = `${entity.name}_${stock_id}_${getFormattedDate(date)}`;
      const cachedData = this.stockDataCache.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const queryBuilder = manager
        .createQueryBuilder(entity, 'entity')
        .where('entity.stock_id = :stockId', { stockId: stock_id })
        .orderBy('entity.startTime', 'DESC')
        .take(this.PAGE_SIZE + 1);

      if (lastStartTime)
        queryBuilder.andWhere('entity.startTime < :lastStartTime', {
          lastStartTime: lastStartTime,
        });

      const resultList = await queryBuilder.getMany();

      const hasMore = resultList.length > this.PAGE_SIZE;
      if (hasMore) resultList.pop();
      const priceDtoList = this.mapResultListToPriceDtoList(resultList);
      const volumeDtoList = this.mapResultListToVolumeDtoList(resultList);
      const response = this.createStockDataResponse(
        priceDtoList,
        volumeDtoList,
        hasMore,
      );
      this.stockDataCache.set(cacheKey, response);
      return response;
    });
  }

  async isStockExist(stockId: string, manager: EntityManager) {
    return await manager.exists(Stock, { where: { id: stockId } });
  }

  mapResultListToPriceDtoList(resultList: StockData[]): PriceDto[] {
    return resultList
      .map((data: StockData) => ({
        startTime: data.startTime,
        open: data.open,
        close: data.close,
        high: data.high,
        low: data.low,
      }))
      .reverse();
  }

  mapResultListToVolumeDtoList(resultList: StockData[]): VolumeDto[] {
    return resultList
      .map((data) => ({
        startTime: data.startTime,
        volume: data.volume,
      }))
      .reverse();
  }

  createStockDataResponse(
    priceDtoList: PriceDto[],
    volumeDtoList: VolumeDto[],
    hasMore: boolean,
  ): StockDataResponse {
    const priceData = plainToInstance(PriceDto, priceDtoList);
    const volumeData = plainToInstance(VolumeDto, volumeDtoList);

    return plainToInstance(StockDataResponse, {
      priceDtoList: priceData,
      volumeDtoList: volumeData,
      hasMore,
    });
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
