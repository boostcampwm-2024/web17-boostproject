import { plainToInstance } from 'class-transformer';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Logger } from 'winston';
import { Stock } from './domain/stock.entity';
import { StockService } from './stock.service';
import { UserStock } from '@/stock/domain/userStock.entity';
import { StockRankResponses, StocksResponse } from '@/stock/dto/stock.response';
import { User } from '@/user/domain/user.entity';
import {
  GainersSortStrategy,
  LosersSortStrategy,
  ViewsSortStrategy,
} from './strategy/StockSortStrategy';

describe('StockService 테스트', () => {
  const stockId = '005930';
  const userId = 1;
  const result = [
    {
      id: '005930',
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
  ];
  let logger: Logger;
  let mockDataSource: DataSource;
  let mockManager: EntityManager;
  let stockService: StockService;
  let queryBuilderMock: SelectQueryBuilder<Stock>;
  let repositoryMock: Repository<Stock>;
  let viewsSortStrategy: ViewsSortStrategy;
  let gainersSortStrategy: GainersSortStrategy;
  let losersSortStrategy: LosersSortStrategy;

  beforeEach(() => {
    mockDataSource = mock(DataSource);
    logger = mock(Logger);
    mockManager = mock(EntityManager);
    queryBuilderMock = mock(SelectQueryBuilder);
    viewsSortStrategy = mock(ViewsSortStrategy);
    gainersSortStrategy = mock(GainersSortStrategy);
    losersSortStrategy = mock(LosersSortStrategy);
    stockService = new StockService(
      instance(mockDataSource),
      instance(logger),
      instance(viewsSortStrategy),
      instance(gainersSortStrategy),
      instance(losersSortStrategy),
    );
    repositoryMock = mock(Repository);
    when(mockDataSource.transaction(anything())).thenCall(async (callback) => {
      return await callback(instance(mockManager));
    });
    when(queryBuilderMock.leftJoin(anything(), anything(), anything()))
      .thenReturn(instance(queryBuilderMock))
      .thenReturn(instance(queryBuilderMock));
    when(queryBuilderMock.select(anything())).thenReturn(
      instance(queryBuilderMock),
    );
    when(queryBuilderMock.orderBy(anything(), anything())).thenReturn(
      instance(queryBuilderMock),
    );
    when(queryBuilderMock.limit(anything())).thenReturn(
      instance(queryBuilderMock),
    );
    when(repositoryMock.createQueryBuilder(anyString())).thenReturn(
      instance(queryBuilderMock),
    );
    when(mockDataSource.getRepository(anything())).thenReturn(
      instance(repositoryMock),
    );
  });

  test('주식의 조회수를 증가시킨다.', async () => {
    when(mockManager.exists(Stock, anything())).thenResolve(true);

    await stockService.increaseView(stockId);

    verify(mockManager.exists(Stock, anything())).once();
    verify(mockManager.increment(Stock, anything(), 'views', 1)).once();
  });

  test('존재하지 않는 주식의 조회수를 증가시키려 하면 예외가 발생한다.', async () => {
    when(mockManager.exists(Stock, anything())).thenResolve(false);

    await expect(() => stockService.increaseView('1')).rejects.toThrow(
      'stock not found',
    );
  });

  test('유저 주식을 추가한다.', async () => {
    when(mockManager.exists(Stock, anything())).thenResolve(true);
    when(mockManager.exists(UserStock, anything())).thenResolve(false);

    await stockService.createUserStock(userId, stockId);

    verify(mockManager.exists(Stock, anything())).times(1);
    verify(mockManager.exists(UserStock, anything())).times(1);
    verify(mockManager.insert(UserStock, anything())).once();
  });

  test('유저 주식을 추가할 때 존재하지 않는 주식이면 예외가 발생한다.', async () => {
    when(mockManager.exists(Stock, anything())).thenResolve(false);

    await expect(() =>
      stockService.createUserStock(userId, 'A'),
    ).rejects.toThrow('not exists stock');
  });

  test('유저 주식을 추가할 때 이미 존재하는 유저 주식이면 예외가 발생한다.', async () => {
    when(mockManager.exists(Stock, anything())).thenResolve(true);
    when(mockManager.exists(UserStock, anything())).thenResolve(true);

    await expect(async () =>
      stockService.createUserStock(userId, stockId),
    ).rejects.toThrow('user stock already exists');
  });

  test('유저 주식을 삭제한다.', async () => {
    when(mockManager.findOne(UserStock, anything())).thenResolve({
      id: 1,
      user: { id: userId } as User,
      stock: { id: stockId } as Stock,
      date: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await stockService.deleteUserStock(userId, stockId);

    verify(mockManager.findOne(UserStock, anything())).once();
    verify(mockManager.delete(UserStock, anything())).once();
  });

  test('유저 주식을 삭제 시 존재하지 않는 유저 주식이면 예외가 발생한다.', async () => {
    when(mockManager.findOne(UserStock, anything())).thenResolve(null);

    await expect(() =>
      stockService.deleteUserStock(userId, '13'),
    ).rejects.toThrow('user stock not found');
  });

  test('유저 주식을 삭제 시 주인이 아닐 때 예외가 발생한다.', async () => {
    const notOwnerUserId = 2;
    when(mockManager.findOne(UserStock, anything())).thenResolve({
      id: 1,
      user: { id: userId } as User,
      stock: { id: stockId } as Stock,
      date: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await expect(() =>
      stockService.deleteUserStock(notOwnerUserId, stockId),
    ).rejects.toThrow('you are not owner of user stock');
  });

  test('소유 주식인지 확인한다.', async () => {
    when(mockManager.exists(UserStock, anything())).thenResolve(true);
    const result = await stockService.isUserStockOwner(stockId, userId);

    expect(result).toBe(true);
  });

  test('인증된 유저가 아니면 소유 주식은 항상 false를 반환한다.', async () => {
    const result = await stockService.isUserStockOwner(stockId);

    expect(result).toBe(false);
  });

  test('주식 조회수 기준 상위 데이터를 반환한다.', async () => {
    const limit = 5;

    when(queryBuilderMock.getRawMany()).thenResolve(result);

    const queryResult = await stockService.getTopStocksByViews(limit);

    expect(queryResult).toStrictEqual(
      plainToInstance(StocksResponse, queryResult),
    );
    verify(queryBuilderMock.getRawMany()).once();
  });

  test('주식 상승률 기준 상위 데이터를 반환한다.', async () => {
    const limit = 20;
    when(
      queryBuilderMock.innerJoinAndSelect(anyString(), anyString()),
    ).thenReturn(instance(queryBuilderMock));
    when(queryBuilderMock.where(anyString(), anything())).thenReturn(
      instance(queryBuilderMock),
    );
    when(queryBuilderMock.getRawMany()).thenResolve(result);
    const queryResult = await stockService.getTopStocksByGainers(limit);

    verify(queryBuilderMock.getRawMany()).once();

    expect(queryResult).toEqual(new StockRankResponses(result));
  });

  test('인증된 유저가 아니면 소유 주식은 항상 false를 반환한다.', async () => {
    const result = await stockService.isUserStockOwner(stockId);

    expect(result).toBe(false);
  });
});
