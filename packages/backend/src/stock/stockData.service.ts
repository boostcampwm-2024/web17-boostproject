import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Stock } from './domain/stock.entity';
import {
  StockDaily,
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
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';
import { getFormattedDate, isTodayWeekend } from '@/utils/date';

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

  async scrollChart(
    entity: new () => StockData,
    stockId: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    if (!(await this.isStockExist(stockId, this.dataSource.manager)))
      throw new NotFoundException('stock not found');
    const cacheKey = this.createCacheKey(entity, stockId, lastStartTime);
    const cachedData = this.stockDataCache.get(cacheKey);

    if (cachedData) {
      const time = new Date();
      const response = this.convertResultsToResponse(cachedData);
      if (!lastStartTime && time.getHours() < 16 && time.getHours() >= 9) {
        return await this.renewResponse(response, entity, stockId);
      }
      return response;
    }
    const results = await this.getChartData(entity, stockId, lastStartTime);
    this.stockDataCache.set(cacheKey, results);
    const response = this.convertResultsToResponse(results);
    const time = new Date();
    if (!lastStartTime && time.getHours() < 16 && time.getHours() >= 9) {
      return await this.renewResponse(response, entity, stockId);
    }
    return response;
  }

  private async getCardDataWithMissing(
    entity: new () => StockData,
    stockId: string,
    periodType: Period,
    lastStartTime?: string,
  ) {
    return new Promise<StockData[]>((resolve) => {
      this.openapiPeriodData.insertCartDataRequest(
        this.getHandleResponseCallback(entity, stockId, resolve, lastStartTime),
        stockId,
        periodType,
      );
    });
  }

  private async findLastData(entity: new () => StockData, stockId: string) {
    return await this.dataSource.manager.findOne(entity, {
      where: { stock: { id: stockId } },
      order: { startTime: 'DESC' },
    });
  }

  private async isStockExist(stockId: string, manager: EntityManager) {
    return await manager.exists(Stock, { where: { id: stockId } });
  }

  private async getChartData(
    entity: new () => StockData,
    stockId: string,
    lastStartTime?: string,
  ) {
    const lastData = await this.findLastData(entity, stockId);
    const periodType = this.getPeriodType(entity);
    if (!periodType) throw new BadRequestException('period type not found');
    if (
      !isTodayWeekend() &&
      !lastStartTime &&
      (!lastData || !this.isLastDate(lastData, periodType))
    ) {
      return await this.getCardDataWithMissing(
        entity,
        stockId,
        periodType,
        lastStartTime,
      );
    }
    return await this.getChartDataFromDB(entity, stockId, lastStartTime);
  }

  private async renewResponse(
    response: StockDataResponse,
    entity: new () => StockData,
    stockId: string,
  ) {
    const liveData = await this.dataSource.manager.findOne(StockLiveData, {
      where: { stock: { id: stockId } },
    });
    if (liveData) {
      response.renewLastData(liveData, entity);
    }
    return response;
  }

  private async getChartDataFromDB(
    entity: new () => StockData,
    stockId: string,
    lastStartTime?: string,
  ) {
    const queryBuilder = this.createQueryBuilder(
      entity,
      stockId,
      this.dataSource.manager,
      lastStartTime,
    );
    return await queryBuilder.getMany();
  }

  private getHandleResponseCallback(
    entity: new () => StockData,
    stockId: string,
    resolve: (value: StockData[]) => void,
    lastStartTime?: string,
  ) {
    return async () => {
      setTimeout(
        async () =>
          resolve(
            await this.getChartDataFromDB(entity, stockId, lastStartTime),
          ),
        2000,
      );

      const response = await this.getChartDataFromDB(
        entity,
        stockId,
        lastStartTime,
      );

      resolve(response);
    };
  }

  private isLastDate(lastData: StockData, period: Period) {
    const lastDate = new NewDate(lastData.startTime);
    const current = new Date();
    if (period === 'D') return lastDate.isSameDate(current);
    if (period === 'M') {
      return (
        lastDate.isSameMonth(current) &&
        (lastDate.isSameDate(current) ||
          (current.getHours() < 16 && current.getHours() > 1))
      );
    }
    if (period === 'Y')
      return (
        lastDate.isSameYear(current) &&
        (lastDate.isSameDate(current) ||
          (current.getHours() < 16 && current.getHours() > 1))
      );
    return (
      lastDate.isSameWeek(current) &&
      (lastData.createdAt.getDate() === current.getDate() ||
        (current.getHours() < 16 && current.getHours() > 1))
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
