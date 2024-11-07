import { DataSource } from 'typeorm';
import { StockService } from './stock.service';

describe('StockService 테스트', () => {
  test('주식의 조회수를 증가시킨다.', async () => {
    const dataSource: Partial<DataSource> = {
      transaction: jest.fn().mockImplementation(async (work) => {
        const managerMock = {
          exists: jest.fn().mockResolvedValue(true),
          increment: jest.fn().mockResolvedValue({ id: 'A005930', views: 1 }),
        };
        return work(managerMock);
      }),
    };
    const stockService = new StockService(dataSource as DataSource);

    await stockService.increaseView('A005930');

    expect(dataSource.transaction).toHaveBeenCalled();
  });

  test('존재하지 않는 주식의 조회수를 증가시키려 하면 예외가 발생한다.', async () => {
    const dataSource: Partial<DataSource> = {
      transaction: jest.fn().mockImplementation(async (work) => {
        const managerMock = {
          exists: jest.fn().mockResolvedValue(false),
        };
        return work(managerMock);
      }),
    };
    const stockService = new StockService(dataSource as DataSource);

    await expect(async () =>
      stockService.increaseView('1'),
    ).rejects.toThrowError('stock not found');
  });
});
