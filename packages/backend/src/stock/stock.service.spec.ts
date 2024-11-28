/* eslint-disable max-lines-per-function */
import { instanceToPlain } from 'class-transformer';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { Stock } from './domain/stock.entity';
import { StockService } from './stock.service';
import { createDataSourceMock } from '@/user/user.service.spec';

const logger: Logger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
} as unknown as Logger;

describe('StockService 테스트', () => {
  const stockId = 'A005930';
  const userId = 1;

  test('주식의 조회수를 증가시킨다.', async () => {
    const managerMock = {
      exists: jest.fn().mockResolvedValue(true),
      increment: jest.fn().mockResolvedValue({ id: stockId, views: 1 }),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    await stockService.increaseView(stockId);

    expect(dataSource.transaction).toHaveBeenCalled();
  });

  test('존재하지 않는 주식의 조회수를 증가시키려 하면 예외가 발생한다.', async () => {
    const managerMock = {
      exists: jest.fn().mockResolvedValue(false),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    await expect(async () => stockService.increaseView('1')).rejects.toThrow(
      'stock not found',
    );
  });

  test('유저 주식을 추가한다.', async () => {
    const managerMock = {
      exists: jest
        .fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false),
      insert: jest.fn(),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    await stockService.createUserStock(userId, stockId);

    expect(managerMock.exists).toHaveBeenCalledTimes(2);
    expect(managerMock.insert).toHaveBeenCalled();
  });

  test('유저 주식을 추가할 때 존재하지 않는 주식이면 예외가 발생한다.', async () => {
    const managerMock = {
      exists: jest.fn().mockResolvedValue(false),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    await expect(() =>
      stockService.createUserStock(userId, 'A'),
    ).rejects.toThrow('not exists stock');
  });

  test('유저 주식을 추가할 때 이미 존재하는 유저 주식이면 예외가 발생한다.', async () => {
    const managerMock = {
      exists: jest.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(true),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    await expect(async () =>
      stockService.createUserStock(userId, stockId),
    ).rejects.toThrow('user stock already exists');
  });

  test('유저 주식을 삭제한다.', async () => {
    const managerMock = {
      findOne: jest.fn().mockResolvedValue({ user: { id: userId } }),
      delete: jest.fn(),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    await stockService.deleteUserStock(userId, stockId);

    expect(managerMock.findOne).toHaveBeenCalled();
    expect(managerMock.delete).toHaveBeenCalled();
  });

  test('유저 주식을 삭제 시 존재하지 않는 유저 주식이면 예외가 발생한다.', async () => {
    const managerMock = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    await expect(() => stockService.deleteUserStock(userId, "13")).rejects.toThrow(
      'user stock not found',
    );
  });

  test('유저 주식을 삭제 시 주인이 아닐 때 예외가 발생한다.', async () => {
    const notOwnerUserId = 2;
    const managerMock = {
      findOne: jest.fn().mockResolvedValue({ user: { id: userId } }),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    await expect(() =>
      stockService.deleteUserStock(notOwnerUserId, stockId),
    ).rejects.toThrow('you are not owner of user stock');
  });

  test('소유 주식인지 확인한다.', async () => {
    const managerMock = {
      exists: jest.fn().mockResolvedValue(true),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    const result = await stockService.isUserStockOwner(stockId, userId);

    expect(result).toBe(true);
    expect(managerMock.exists).toHaveBeenCalled();
  });

  test('인증된 유저가 아니면 소유 주식은 항상 false를 반환한다.', async () => {
    const dataSource = createDataSourceMock({});
    const stockService = new StockService(dataSource as DataSource, logger);

    const result = await stockService.isUserStockOwner(stockId);

    expect(result).toBe(false);
  });

  test('주식 조회수 기준 상위 데이터를 반환한다.', async () => {
    const limit = 5;
    // QueryBuilder Mock
    const queryBuilderMock = {
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        {
          id: 'A005930',
          name: '삼성전자',
          currentPrice: '100000.0',
          changeRate: '2.5',
          volume: '500000',
          marketCap: '500000000000.00',
        },
        {
          id: 'A051910',
          name: 'LG화학',
          currentPrice: '75000.0',
          changeRate: '-1.2',
          volume: '300000',
          marketCap: '20000000000.00',
        },
      ]),
    };

    // Manager Mock
    const managerMock = {
      getRepository: jest.fn().mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
      }),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    const result = await stockService.getTopStocksByViews(limit);

    expect(managerMock.getRepository).toHaveBeenCalledWith(Stock);
    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
      'stock.views',
      'DESC',
    );
    expect(queryBuilderMock.limit).toHaveBeenCalledWith(limit);
    expect(queryBuilderMock.getRawMany).toHaveBeenCalled();

    expect(instanceToPlain(result)).toEqual([
      {
        id: 'A005930',
        name: '삼성전자',
        currentPrice: 100000.0,
        changeRate: 2.5,
        volume: 500000,
        marketCap: '500000000000.00',
      },
      {
        id: 'A051910',
        name: 'LG화학',
        currentPrice: 75000.0,
        changeRate: -1.2,
        volume: 300000,
        marketCap: '20000000000.00',
      },
    ]);
  });

  test('주식 상승률 기준 상위 데이터를 반환한다.', async () => {
    const limit = 20;
    // QueryBuilder Mock
    const queryBuilderMock = {
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        {
          id: 'A005930',
          name: '삼성전자',
          currentPrice: '100000.0',
          changeRate: '2.5',
          volume: '500000',
          marketCap: '500000000000.00',
        },
        {
          id: 'A051910',
          name: 'LG화학',
          currentPrice: '75000.0',
          changeRate: '-1.2',
          volume: '300000',
          marketCap: '20000000000.00',
        },
      ]),
    };

    // Manager Mock
    const managerMock = {
      getRepository: jest.fn().mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
      }),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    const result = await stockService.getTopStocksByGainers(limit);

    expect(managerMock.getRepository).toHaveBeenCalledWith(Stock);
    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
      'stockLiveData.changeRate',
      'DESC',
    );
    expect(queryBuilderMock.limit).toHaveBeenCalledWith(limit);
    expect(queryBuilderMock.getRawMany).toHaveBeenCalled();

    expect(instanceToPlain(result)).toEqual([
      {
        id: 'A005930',
        name: '삼성전자',
        currentPrice: 100000.0,
        changeRate: 2.5,
        volume: 500000,
        marketCap: '500000000000.00',
      },
      {
        id: 'A051910',
        name: 'LG화학',
        currentPrice: 75000.0,
        changeRate: -1.2,
        volume: 300000,
        marketCap: '20000000000.00',
      },
    ]);
  });

  test('소유 주식인지 확인한다.', async () => {
    const managerMock = {
      exists: jest.fn().mockResolvedValue(true),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    const result = await stockService.isUserStockOwner(stockId, userId);

    expect(result).toBe(true);
    expect(managerMock.exists).toHaveBeenCalled();
  });

  test('인증된 유저가 아니면 소유 주식은 항상 false를 반환한다.', async () => {
    const dataSource = createDataSourceMock({});
    const stockService = new StockService(dataSource as DataSource, logger);

    const result = await stockService.isUserStockOwner(stockId);

    expect(result).toBe(false);
  });

  test('주식 하락률 기준 상위 데이터를 반환한다.', async () => {
    const limit = 20;
    // QueryBuilder Mock
    const queryBuilderMock = {
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        {
          id: 'A051910',
          name: 'LG화학',
          currentPrice: '75000.0',
          changeRate: '-1.2',
          volume: '300000',
          marketCap: '20000000000.00',
        },
        {
          id: 'A005930',
          name: '삼성전자',
          currentPrice: '100000.0',
          changeRate: '2.5',
          volume: '500000',
          marketCap: '500000000000.00',
        },
      ]),
    };

    // Manager Mock
    const managerMock = {
      getRepository: jest.fn().mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
      }),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    const result = await stockService.getTopStocksByLosers(limit);

    expect(managerMock.getRepository).toHaveBeenCalledWith(Stock);
    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
      'stockLiveData.changeRate',
      'ASC',
    );
    expect(queryBuilderMock.limit).toHaveBeenCalledWith(limit);
    expect(queryBuilderMock.getRawMany).toHaveBeenCalled();

    expect(instanceToPlain(result)).toEqual([
      {
        id: 'A051910',
        name: 'LG화학',
        currentPrice: 75000.0,
        changeRate: -1.2,
        volume: 300000,
        marketCap: '20000000000.00',
      },
      {
        id: 'A005930',
        name: '삼성전자',
        currentPrice: 100000.0,
        changeRate: 2.5,
        volume: 500000,
        marketCap: '500000000000.00',
      },
    ]);
  });
});
