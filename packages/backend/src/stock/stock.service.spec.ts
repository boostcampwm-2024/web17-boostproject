import { plainToInstance } from 'class-transformer';
import { instance, mock, verify, when } from 'ts-mockito';
import { Logger } from 'winston';
import { Stock } from './domain/stock.entity';
import { StockService } from './stock.service';
import {
  StockRankResponses,
  StockSearchResponse,
  StocksResponse,
} from '@/stock/dto/stock.response';
import { User } from '@/user/domain/user.entity';
import { StockRepository } from './repository/stock.repository';
import { UserStockRepository } from './repository/userStock.repository';

describe('StockService 테스트', () => {
  // mocked classes
  let mockLogger: Logger;
  let mockStockRepository: StockRepository;
  let mockUserStockRepository: UserStockRepository;

  // test target
  let stockService: StockService;

  beforeEach(() => {
    mockStockRepository = mock(StockRepository);
    mockUserStockRepository = mock(UserStockRepository);
    mockLogger = mock(Logger);

    stockService = new StockService(
      instance(mockStockRepository),
      instance(mockUserStockRepository),
      instance(mockLogger),
    );
  });

  describe('주식 조회수', () => {
    test('주식의 조회수를 증가시킨다.', async () => {
      // given
      const stockId = '005930';
      when(mockStockRepository.existsById(stockId)).thenResolve(true);

      // when
      await stockService.increaseView(stockId);

      // then
      verify(mockStockRepository.existsById(stockId)).once();
      verify(mockStockRepository.increaseView(stockId)).once();
    });

    test('존재하지 않는 주식의 조회수를 증가시키려 하면 예외가 발생한다.', async () => {
      // given
      const nonExistStock = '1';
      when(mockStockRepository.existsById(nonExistStock)).thenResolve(false);

      // when & then
      await expect(() =>
        stockService.increaseView(nonExistStock),
      ).rejects.toThrow('stock not found');
    });
  });

  describe('주식 정렬 조회', () => {
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
      const sortBy = 'views';
      when(mockStockRepository.findByTopViews(limit)).thenResolve(stockList);

      // when
      const queryResult = await stockService.getTopStocks(sortBy, limit);

      // then
      expect(queryResult).toStrictEqual(
        plainToInstance(StocksResponse, queryResult),
      );
    });

    test('주식 상승률 기준 상위 데이터를 반환한다.', async () => {
      // given
      const limit = 20;
      const sortBy = 'gainers';
      when(mockStockRepository.findByTopGainers(limit)).thenResolve(stockList);

      // when
      const queryResult = await stockService.getTopStocks(sortBy, limit);

      // then
      verify(mockStockRepository.findByTopGainers(limit)).once();
      expect(queryResult).toEqual(new StockRankResponses(stockList));
    });

    test('주식 하락률 기준 상위 데이터를 반환한다.', async () => {
      // given
      const limit = 20;
      const sortBy = 'losers';
      when(mockStockRepository.findByTopLosers(limit)).thenResolve(stockList);

      // when
      const queryResult = await stockService.getTopStocks(sortBy, limit);

      // then
      verify(mockStockRepository.findByTopLosers(limit)).once();
      expect(queryResult).toEqual(new StockRankResponses(stockList));
    });

    test('주식 정렬 전략이 잘못된 요청은 예외가 발생한다.', async () => {
      // given
      const limit = 20;
      const wrongSortBy = 'infinite';

      // when & then
      await expect(() =>
        stockService.getTopStocks(wrongSortBy, limit),
      ).rejects.toThrow(`Unknown sort strategy: ${wrongSortBy}`);
    });
  });

  describe('주식 정보 조회', () => {
    test('주식 이름으로 주식을 검색한다.', async () => {
      // given
      const stockName = '삼성';
      const mockStocks = [
        { id: '005930', name: '삼성전자', views: 3 } as Stock,
        { id: '006400', name: '삼성SDI', views: 1 } as Stock,
      ];
      when(mockStockRepository.findByName(stockName)).thenResolve(mockStocks);

      // when
      const result = await stockService.searchStock(stockName);

      // then
      expect(result).toEqual(new StockSearchResponse(mockStocks));
    });
  });

  describe('유저 주식 추가', () => {
    test('유저 주식을 추가한다.', async () => {
      // given
      const userId = 1;
      const stockId = '005930';
      when(mockStockRepository.existsById(stockId)).thenResolve(true);
      when(mockUserStockRepository.exists(userId, stockId)).thenResolve(false);

      // when
      await stockService.createUserStock(userId, stockId);

      // then
      verify(mockStockRepository.existsById(stockId)).once();
      verify(mockUserStockRepository.exists(userId, stockId)).once();
      verify(mockUserStockRepository.create(userId, stockId)).once();
    });

    test('유저 주식을 추가할 때 존재하지 않는 주식이면 예외가 발생한다.', async () => {
      // given
      const userId = 1;
      const nonExistStock = 'A';
      when(mockStockRepository.existsById(nonExistStock)).thenResolve(false);

      // when & then
      await expect(() =>
        stockService.createUserStock(userId, nonExistStock),
      ).rejects.toThrow('not exists stock');
    });

    test('유저 주식을 추가할 때 이미 존재하는 유저 주식이면 예외가 발생한다.', async () => {
      // given
      const userId = 1;
      const stockId = '005930';
      when(mockStockRepository.existsById(stockId)).thenResolve(true);
      when(mockUserStockRepository.exists(userId, stockId)).thenResolve(true);

      // when & then
      await expect(async () =>
        stockService.createUserStock(userId, stockId),
      ).rejects.toThrow('user stock already exists');
    });
  });

  describe('유저 주식 삭제', () => {
    test('유저 주식을 삭제한다.', async () => {
      // given
      const userId = 1;
      const stockId = '005930';
      const userStock = {
        id: 10,
        user: { id: userId } as User,
        stock: { id: stockId } as Stock,
        date: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      when(
        mockUserStockRepository.findByUserIdAndStockId(userId, stockId),
      ).thenResolve(userStock);

      // when
      await stockService.deleteUserStock(userId, stockId);

      // then
      verify(
        mockUserStockRepository.findByUserIdAndStockId(userId, stockId),
      ).once();
      verify(mockUserStockRepository.delete(userStock.id)).once();
    });

    test('유저 주식을 삭제 시 존재하지 않는 유저 주식이면 예외가 발생한다.', async () => {
      // given
      const userId = 1;
      const nonUserStock = '005930';
      when(
        mockUserStockRepository.findByUserIdAndStockId(userId, nonUserStock),
      ).thenResolve(null);

      // when & then
      await expect(() =>
        stockService.deleteUserStock(userId, nonUserStock),
      ).rejects.toThrow('user stock not found');
    });

    test('유저 주식을 삭제 시 주인이 아닐 때 예외가 발생한다.', async () => {
      // given
      const userId = 1;
      const stockId = '005930';
      const userStock = {
        id: 13,
        user: { id: 2 } as User,
        stock: { id: stockId } as Stock,
        date: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      when(
        mockUserStockRepository.findByUserIdAndStockId(userId, stockId),
      ).thenResolve(userStock);

      // when & then
      await expect(() =>
        stockService.deleteUserStock(userId, stockId),
      ).rejects.toThrow('you are not owner of user stock');
    });
  });

  describe('유저 주식 조회', () => {
    test('소유 주식인지 확인한다.', async () => {
      // given
      const userId = 1;
      const stockId = '005930';
      when(mockUserStockRepository.exists(userId, stockId)).thenResolve(true);

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
});
