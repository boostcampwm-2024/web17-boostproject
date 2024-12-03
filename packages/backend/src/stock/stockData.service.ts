import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { OpenapiPeriodData } from '@/scraper/openapi/api/openapiPeriodData.api';
import { Period } from '@/scraper/openapi/type/openapiPeriodData.type';
import { NewDate } from '@/scraper/openapi/util/newDate.util';
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
    private readonly openapiPeriodData: OpenapiPeriodData,
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
      const lastData = results[0];
      const periodType = this.getPeriodType(entity);
      if (!periodType) throw new BadRequestException('period type not found');
      if (
        !lastStartTime &&
        (!lastData || !this.isLastDate(lastData, periodType))
      ) {
        return new Promise((resolve) => {
          this.openapiPeriodData.insertCartDataRequest(
            (value) => {
              const index = this.findExistDataIndex(value, lastData);
              const response = this.convertResultsToResponse([
                ...value.slice(index + 1).reverse(),
                ...results,
              ]);
              this.stockDataCache.set(cacheKey, response);
              resolve(response);
            },
            stockId,
            periodType,
          );
        });
      }
      const response = this.convertResultsToResponse(results);
      this.stockDataCache.set(cacheKey, response);
      return response;
    });
  }

  async isStockExist(stockId: string, manager: EntityManager) {
    return await manager.exists(Stock, { where: { id: stockId } });
  }

  private isLastDate(lastData: StockData, period: Period) {
    const lastDate = new NewDate(lastData.startTime);
    const current = new Date();
    if (period === 'D') return lastDate.isSameDate(current);
    if (period === 'M') {
      return lastDate.isSameWeek(current) && lastDate.isSameYear(current);
    }
    if (period === 'Y') return lastDate.isSameYear(current);
    return lastDate.isSameWeek(current);
  }

  private findExistDataIndex(responseData: StockData[], lastData: StockData) {
    if (!lastData) return -1;
    const lastDate = new NewDate(lastData.startTime);
    return responseData.findIndex((data) =>
      lastDate.isSameDate(data.startTime),
    );
  }

  private getPeriodType(entity: new () => StockData) {
    if (entity === StockDaily) return 'D';
    if (entity === StockWeekly) return 'W';
    if (entity === StockMonthly) return 'M';
    if (entity === StockYearly) return 'Y';
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
  constructor(
    dataSource: DataSource,
    stockDataCache: StockDataCache,
    openapiPeriodData: OpenapiPeriodData,
  ) {
    super(dataSource, stockDataCache, openapiPeriodData);
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
  constructor(
    dataSource: DataSource,
    stockDataCache: StockDataCache,
    openapiPeriodData: OpenapiPeriodData,
  ) {
    super(dataSource, stockDataCache, openapiPeriodData);
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
  constructor(
    dataSource: DataSource,
    stockDataCache: StockDataCache,
    openapiPeriodData: OpenapiPeriodData,
  ) {
    super(dataSource, stockDataCache, openapiPeriodData);
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
  constructor(
    dataSource: DataSource,
    stockDataCache: StockDataCache,
    openapiPeriodData: OpenapiPeriodData,
  ) {
    super(dataSource, stockDataCache, openapiPeriodData);
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
  constructor(
    dataSource: DataSource,
    stockDataCache: StockDataCache,
    openapiPeriodData: OpenapiPeriodData,
  ) {
    super(dataSource, stockDataCache, openapiPeriodData);
  }
  async getStockDataYearly(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.getPaginated(StockYearly, stock_id, lastStartTime);
  }
}
