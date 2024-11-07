import { DataSource } from 'typeorm';
import { StockService } from './stock.service';
import { createDataSourceMock } from '@/user/user.service.spec';

describe('StockService 테스트', () => {
  test('주식의 조회수를 증가시킨다.', async () => {
    const managerMock = {
      exists: jest.fn().mockResolvedValue(true),
      increment: jest.fn().mockResolvedValue({ id: 'A005930', views: 1 }),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource);

    await stockService.increaseView('A005930');

    expect(dataSource.transaction).toHaveBeenCalled();
  });

  test('존재하지 않는 주식의 조회수를 증가시키려 하면 예외가 발생한다.', async () => {
    const managerMock = {
      exists: jest.fn().mockResolvedValue(false),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource);

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
    const stockService = new StockService(dataSource as DataSource);

    await stockService.createUserStock(1, 'A005930');

    expect(managerMock.exists).toHaveBeenCalledTimes(2);
    expect(managerMock.insert).toHaveBeenCalled();
  });

  test('유저 주식을 추가할 때 존재하지 않는 주식이면 예외가 발생한다.', async () => {
    const managerMock = {
      exists: jest.fn().mockResolvedValue(false),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource);

    await expect(() => stockService.createUserStock(1, 'A')).rejects.toThrow(
      'not exists stock',
    );
  });

  test('유저 주식을 추가할 때 이미 존재하는 유저 주식이면 예외가 발생한다.', async () => {
    const managerMock = {
      exists: jest.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(true),
    };
    const dataSource = createDataSourceMock(managerMock);
    const stockService = new StockService(dataSource as DataSource);

    await expect(async () =>
      stockService.createUserStock(1, 'A005930'),
    ).rejects.toThrow('user stock already exists');
  });
});
