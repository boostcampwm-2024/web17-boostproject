/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { Stock } from './domain/stock.entity';
import { StockLiveData } from './domain/stockLiveData.entity';
import { StockIndexRateResponse } from './dto/stockIndexRate.response';
import { StockRateIndexService } from './stockRateIndex.service';

describe('StockRateIndexService', () => {
  let stockRateIndexService: StockRateIndexService;
  let dataSource: Partial<DataSource>;
  const logger: Logger = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  } as unknown as Logger;

  const createDataSourceMock = (managerMock: any): Partial<DataSource> => {
    return {
      manager: managerMock,
    };
  };

  beforeEach(() => {
    const mockStockLiveData: Partial<StockLiveData> = {
      volume: 1000,
      high: 1200,
      low: 800,
      open: 1000,
      stock: { id: 'KRW', name: 'KRW', groupCode: 'IDX' } as Stock,
    };

    const managerMock = {
      find: jest.fn().mockResolvedValue([mockStockLiveData]),
    };

    dataSource = createDataSourceMock(managerMock);
    stockRateIndexService = new StockRateIndexService(
      dataSource as DataSource,
      logger as Logger,
    );
  });

  it('존재하면 데이터를 리턴한다', async () => {
    const response = await stockRateIndexService.getStockRateIndexDate();

    expect(response).toBeInstanceOf(Array);
    expect(response[0]).toBeInstanceOf(StockIndexRateResponse);
    expect(response[0].name).toBe('KRW');
    expect(response[0].volume).toBe(1000);
  });

  it('존재하지 않으면 에러를 발생시킨다', async () => {
    const managerMock = {
      find: jest.fn().mockResolvedValue([]),
    };

    dataSource = createDataSourceMock(managerMock);
    stockRateIndexService = new StockRateIndexService(
      dataSource as DataSource,
      logger as Logger,
    );

    await expect(stockRateIndexService.getStockRateIndexDate()).rejects.toThrow(
      NotFoundException,
    );
  });
});
