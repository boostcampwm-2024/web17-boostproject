import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { Stock } from './domain/stock.entity';
import {
  StockMinutely,
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
  protected readonly DEFAULT_COLOR = 'red';

  constructor(private readonly dataSource: DataSource) {}

  async getPaginated(
    entity: new () => StockData,
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.dataSource.manager.transaction(async (manager) => {
      if (!(await manager.exists(Stock, { where: { id: stock_id } })))
        throw new NotFoundException('stock not found');

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

      return this.createStockDataResponse(priceDtoList, volumeDtoList, hasMore);
    });
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

    const responseDto = plainToInstance(StockDataResponse, {
      priceDtoList: priceData,
      volumeDtoList: volumeData,
      hasMore,
    });

    return responseDto;
  }
}

@Injectable()
export class StockDataMinutelyService extends StockDataService {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
  async getStockDataMinutely(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    const response = await this.getPaginated(
      StockMinutely,
      stock_id,
      lastStartTime,
    );

    return response;
  }
}

@Injectable()
export class StockDataDailyService extends StockDataService {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
  async getStockDataDaily(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    const response = await this.getPaginated(
      StockDaily,
      stock_id,
      lastStartTime,
    );

    return response;
  }
}

@Injectable()
export class StockDataWeeklyService extends StockDataService {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
  async getStockDataWeekly(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    const response = await this.getPaginated(
      StockWeekly,
      stock_id,
      lastStartTime,
    );

    return response;
  }
}

@Injectable()
export class StockDataMonthlyService extends StockDataService {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
  async getStockDataMonthly(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    const response = await this.getPaginated(
      StockMonthly,
      stock_id,
      lastStartTime,
    );

    return response;
  }
}

@Injectable()
export class StockDataYearlyService extends StockDataService {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
  async getStockDataYearly(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    const response = await this.getPaginated(
      StockYearly,
      stock_id,
      lastStartTime,
    );

    return response;
  }
}
