import { DataSource } from 'typeorm';
import { Logger } from 'winston';
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
  const userStockId = 1;

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

    await stockService.deleteUserStock(userId, userStockId);

    expect(managerMock.findOne).toHaveBeenCalled();
    expect(managerMock.delete).toHaveBeenCalled();
  });

  test('유저 주식을 삭제 시 존재하지 않는 유저 주식이면 예외가 발생한다.', async () => {
    const managerMock = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource, logger);

    await expect(() => stockService.deleteUserStock(userId, 2)).rejects.toThrow(
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
      stockService.deleteUserStock(notOwnerUserId, userStockId),
    ).rejects.toThrow('you are not owner of user stock');
  });
});
