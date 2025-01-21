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
  // mocked classes
  let mockLogger: Logger;
  let mockDataSource: DataSource;
  let mockManager: EntityManager;
  let mockQueryBuilder: SelectQueryBuilder<Stock>;
  let mockRepository: Repository<Stock>;
  let mockViewsSortStrategy: ViewsSortStrategy;
  let mockGainersSortStrategy: GainersSortStrategy;
  let mockLosersSortStrategy: LosersSortStrategy;

  // test target
  let stockService: StockService;

  beforeEach(() => {
    mockDataSource = mock(DataSource);
    mockManager = mock(EntityManager);
    mockQueryBuilder = mock(SelectQueryBuilder);
    mockRepository = mock(Repository);

    mockLogger = mock(Logger);
    mockViewsSortStrategy = mock(ViewsSortStrategy);
    mockGainersSortStrategy = mock(GainersSortStrategy);
    mockLosersSortStrategy = mock(LosersSortStrategy);

    stockService = new StockService(
      instance(mockDataSource),
      instance(mockLogger),
      instance(mockViewsSortStrategy),
      instance(mockGainersSortStrategy),
      instance(mockLosersSortStrategy),
    );

    // stock service 내부에서 사용하는 typeorm 메서드 mocking
    when(mockDataSource.transaction(anything())).thenCall(async (callback) => {
      return await callback(instance(mockManager));
    });
    when(mockQueryBuilder.leftJoin(anything(), anything(), anything()))
      .thenReturn(instance(mockQueryBuilder))
      .thenReturn(instance(mockQueryBuilder));
    when(mockQueryBuilder.select(anything())).thenReturn(
      instance(mockQueryBuilder),
    );
    when(mockQueryBuilder.orderBy(anything(), anything())).thenReturn(
      instance(mockQueryBuilder),
    );
    when(mockQueryBuilder.limit(anything())).thenReturn(
      instance(mockQueryBuilder),
    );
    when(mockRepository.createQueryBuilder(anyString())).thenReturn(
      instance(mockQueryBuilder),
    );
    when(mockDataSource.getRepository(anything())).thenReturn(
      instance(mockRepository),
    );
    when(
      mockQueryBuilder.innerJoinAndSelect(anyString(), anyString()),
    ).thenReturn(instance(mockQueryBuilder));
    when(mockQueryBuilder.where(anyString(), anything())).thenReturn(
      instance(mockQueryBuilder),
    );
  });

  describe('주식 조회수', () => {
    test('주식의 조회수를 증가시킨다.', async () => {
      // given
      const stockId = '005930';
      when(mockManager.exists(Stock, anything())).thenResolve(true);

      // when
      await stockService.increaseView(stockId);

      // then
      verify(mockManager.exists(Stock, anything())).once();
      verify(mockManager.increment(Stock, anything(), 'views', 1)).once();
    });

    test('존재하지 않는 주식의 조회수를 증가시키려 하면 예외가 발생한다.', async () => {
      // given
      when(mockManager.exists(Stock, anything())).thenResolve(false);

      // when & then
      await expect(() => stockService.increaseView('1')).rejects.toThrow(
        'stock not found',
      );
    });
  });

  describe('유저 주식 관리', () => {
    test('유저 주식을 추가한다.', async () => {
      // given
      const userId = 1;
      const stockId = '005930';
      when(mockManager.exists(Stock, anything())).thenResolve(true);
      when(mockManager.exists(UserStock, anything())).thenResolve(false);

      // when
      await stockService.createUserStock(userId, stockId);

      // then
      verify(mockManager.exists(Stock, anything())).times(1);
      verify(mockManager.exists(UserStock, anything())).times(1);
      verify(mockManager.insert(UserStock, anything())).once();
    });

    test('유저 주식을 추가할 때 존재하지 않는 주식이면 예외가 발생한다.', async () => {
      // given
      const userId = 1;
      when(mockManager.exists(Stock, anything())).thenResolve(false);

      // when & then
      await expect(() =>
        stockService.createUserStock(userId, 'A'),
      ).rejects.toThrow('not exists stock');
    });

    test('유저 주식을 추가할 때 이미 존재하는 유저 주식이면 예외가 발생한다.', async () => {
      // given
      const userId = 1;
      const stockId = '005930';
      when(mockManager.exists(Stock, anything())).thenResolve(true);
      when(mockManager.exists(UserStock, anything())).thenResolve(true);

      // when & then
      await expect(async () =>
        stockService.createUserStock(userId, stockId),
      ).rejects.toThrow('user stock already exists');
    });

    test('유저 주식을 삭제한다.', async () => {
      // given
      const userId = 1;
      const stockId = '005930';
      when(mockManager.findOne(UserStock, anything())).thenResolve({
        id: 1,
        user: { id: userId } as User,
        stock: { id: stockId } as Stock,
        date: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // when
      await stockService.deleteUserStock(userId, stockId);

      // then
      verify(mockManager.findOne(UserStock, anything())).once();
      verify(mockManager.delete(UserStock, anything())).once();
    });

    test('유저 주식을 삭제 시 존재하지 않는 유저 주식이면 예외가 발생한다.', async () => {
      // given
      const userId = 1;
      when(mockManager.findOne(UserStock, anything())).thenResolve(null);

      // when & then
      await expect(() =>
        stockService.deleteUserStock(userId, '13'),
      ).rejects.toThrow('user stock not found');
    });

    test('유저 주식을 삭제 시 주인이 아닐 때 예외가 발생한다.', async () => {
      // given
      const userId = 1;
      const stockId = '005930';
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

      // when & then
      await expect(() =>
        stockService.deleteUserStock(notOwnerUserId, stockId),
      ).rejects.toThrow('you are not owner of user stock');
    });

    test('소유 주식인지 확인한다.', async () => {
      // given
      const userId = 1;
      const stockId = '005930';
      when(mockManager.exists(UserStock, anything())).thenResolve(true);

      // when
      const result = await stockService.isUserStockOwner(stockId, userId);

      // then
      expect(result).toBe(true);
    });

    test('인증된 유저가 아니면 소유 주식은 항상 false를 반환한다.', async () => {
      // given
      const stockId = '005930';
      const userId = undefined;

      // when
      const result = await stockService.isUserStockOwner(stockId, userId);

      // then
      expect(result).toBe(false);
    });
  });

  describe('주식 검색', () => {
    const stockList = [
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

    test('주식 조회수 기준 상위 데이터를 반환한다.', async () => {
      //given
      const limit = 5;
      when(mockQueryBuilder.getRawMany()).thenResolve(stockList);

      // when
      const queryResult = await stockService.getTopStocksByViews(limit);

      // then
      expect(queryResult).toStrictEqual(
        plainToInstance(StocksResponse, queryResult),
      );
    });

    test('주식 상승률 기준 상위 데이터를 반환한다.', async () => {
      // given
      const limit = 20;
      when(mockQueryBuilder.getRawMany()).thenResolve(stockList);

      // when
      const queryResult = await stockService.getTopStocksByGainers(limit);

      // then
      verify(mockQueryBuilder.getRawMany()).once();
      expect(queryResult).toEqual(new StockRankResponses(stockList));
    });
  });
});
