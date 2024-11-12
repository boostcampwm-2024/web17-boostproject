import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { StockDetail } from './domain/stockDetail.entity';
import { StockDetailService } from './stockDetail.service';
import { createDataSourceMock } from '@/user/user.service.spec';

const logger: Logger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
} as unknown as Logger;

describe('StockDetailService 테스트', () => {
  const stockId = 'A005930';

  test('stockId로 주식 상세 정보를 조회한다.', async () => {
    const mockStockDetail = {
      stock: { id: stockId },
      marketCap: 352510000000000,
      eps: 4091,
      per: 17.51,
      high52w: 88000,
      low52w: 53000,
    };
    const managerMock = {
      existsBy: jest.fn().mockResolvedValue(true),
      findBy: jest.fn().mockResolvedValue([mockStockDetail]),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockDetailService = new StockDetailService(
      dataSource as DataSource,
      logger,
    );

    const result = await stockDetailService.getStockDetailByStockId(stockId);

    expect(managerMock.existsBy).toHaveBeenCalledWith(StockDetail, {
      stock: { id: stockId },
    });
    expect(managerMock.findBy).toHaveBeenCalledWith(StockDetail, {
      stock: { id: stockId },
    });
    expect(result).toMatchObject({
      marketCap: expect.any(Number),
      eps: expect.any(Number),
      per: expect.any(Number),
      high52w: expect.any(Number),
      low52w: expect.any(Number),
    });
    expect(result.marketCap).toEqual(mockStockDetail.marketCap);
    expect(result.eps).toEqual(mockStockDetail.eps);
    expect(result.per).toEqual(mockStockDetail.per);
    expect(result.high52w).toEqual(mockStockDetail.high52w);
    expect(result.low52w).toEqual(mockStockDetail.low52w);
  });

  test('존재하지 않는 stockId로 조회 시 예외를 발생시킨다.', async () => {
    const managerMock = {
      existsBy: jest.fn().mockResolvedValue(false),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockDetailService = new StockDetailService(
      dataSource as DataSource,
      logger,
    );

    await expect(
      stockDetailService.getStockDetailByStockId('nonexistentId'),
    ).rejects.toThrow(NotFoundException);
    expect(logger.warn).toHaveBeenCalledWith(
      `stock detail not found (stockId: nonexistentId)`,
    );
  });
});
