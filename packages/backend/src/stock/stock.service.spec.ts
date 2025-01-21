import { plainToInstance } from 'class-transformer';
import { anyNumber, anyString, instance, mock, verify, when } from 'ts-mockito';
import { Logger } from 'winston';
import { Stock } from './domain/stock.entity';
import { StockService } from './stock.service';
import { StockRankResponses, StocksResponse } from '@/stock/dto/stock.response';
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
      when(mockStockRepository.existsById(anyString())).thenResolve(true);

      // when
      await stockService.increaseView(stockId);

      // then
      verify(mockStockRepository.existsById(anyString())).once();
      verify(mockStockRepository.increaseView(anyString())).once();
    });

    test('존재하지 않는 주식의 조회수를 증가시키려 하면 예외가 발생한다.', async () => {
      // given
      when(mockStockRepository.existsById(anyString())).thenResolve(false);

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
      when(mockStockRepository.existsById(anyString())).thenResolve(true);
      when(
        mockUserStockRepository.exists(anyNumber(), anyString()),
      ).thenResolve(false);

      // when
      await stockService.createUserStock(userId, stockId);

      // then
      verify(mockStockRepository.existsById(anyString())).times(1);
      verify(mockUserStockRepository.exists(anyNumber(), anyString())).times(1);
      verify(mockUserStockRepository.create(anyNumber(), anyString())).once();
    });

    test('유저 주식을 추가할 때 존재하지 않는 주식이면 예외가 발생한다.', async () => {
      // given
      const userId = 1;
      when(mockStockRepository.existsById(anyString())).thenResolve(false);

      // when & then
      await expect(() =>
        stockService.createUserStock(userId, 'A'),
      ).rejects.toThrow('not exists stock');
    });

    test('유저 주식을 추가할 때 이미 존재하는 유저 주식이면 예외가 발생한다.', async () => {
      // given
      const userId = 1;
      const stockId = '005930';
      when(mockStockRepository.existsById(anyString())).thenResolve(true);
      when(
        mockUserStockRepository.exists(anyNumber(), anyString()),
      ).thenResolve(true);

      // when & then
      await expect(async () =>
        stockService.createUserStock(userId, stockId),
      ).rejects.toThrow('user stock already exists');
    });

    test('유저 주식을 삭제한다.', async () => {
      // given
      const userId = 1;
      const stockId = '005930';
      when(
        mockUserStockRepository.findByUserIdAndStockId(
          anyNumber(),
          anyString(),
        ),
      ).thenResolve({
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
      verify(
        mockUserStockRepository.findByUserIdAndStockId(
          anyNumber(),
          anyString(),
        ),
      ).once();
      verify(mockUserStockRepository.delete(anyNumber())).once();
    });

    test('유저 주식을 삭제 시 존재하지 않는 유저 주식이면 예외가 발생한다.', async () => {
      // given
      const userId = 1;
      when(
        mockUserStockRepository.findByUserIdAndStockId(
          anyNumber(),
          anyString(),
        ),
      ).thenResolve(null);

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
      when(
        mockUserStockRepository.findByUserIdAndStockId(
          anyNumber(),
          anyString(),
        ),
      ).thenResolve({
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
      when(
        mockUserStockRepository.exists(anyNumber(), anyString()),
      ).thenResolve(true);

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
      when(mockStockRepository.findByTopViews(limit)).thenResolve(stockList);

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
      when(mockStockRepository.findByTopGainers(limit)).thenResolve(stockList);

      // when
      const queryResult = await stockService.getTopStocksByGainers(limit);

      // then
      verify(mockStockRepository.findByTopGainers(anyNumber())).once();
      expect(queryResult).toEqual(new StockRankResponses(stockList));
    });
  });
});
