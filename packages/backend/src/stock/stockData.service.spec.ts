/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToInstance } from 'class-transformer';
import { DataSource, EntityManager, SelectQueryBuilder } from 'typeorm';
import { Stock } from './domain/stock.entity';
import {
  StockMinutely,
  StockDaily,
  StockWeekly,
  StockMonthly,
  StockYearly,
} from './domain/stockData.entity';
import {
  StockDataResponse,
  PriceDto,
  VolumeDto,
} from './dto/stockData.response';
import { StockDataService } from './stockData.service';

// Mock DataSource와 EntityManager 생성 함수
export function createDataSourceMock(
  managerMock: Partial<EntityManager>,
): Partial<DataSource> {
  return {
    manager: {
      ...managerMock,
      transaction: jest.fn().mockImplementation(async (work) => {
        return work(managerMock as EntityManager);
      }),
    } as any, // TypeScript 오류를 피하기 위해 any로 캐스팅
  };
}

// QueryBuilder 모킹을 위한 헬퍼 함수
const createQueryBuilderMock = (
  getManyResult: any[] = [],
  throwError: boolean = false,
): Partial<SelectQueryBuilder<any>> => {
  return {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockImplementation(() => {
      if (throwError) {
        return Promise.reject(new Error('Query error'));
      }
      return Promise.resolve(getManyResult);
    }),
  };
};

describe('StockDataService', () => {
  const stockId = 'A005930';
  let dataSource: Partial<DataSource>;
  let stockDataService: StockDataService;
  let managerMock: any;

  beforeEach(() => {
    managerMock = {
      createQueryBuilder: jest.fn(),
      exists: jest.fn().mockResolvedValue(true),
    };
    dataSource = createDataSourceMock(managerMock);
    stockDataService = new StockDataService(dataSource as DataSource);
  });

  describe('getPaginated', () => {
    const PAGE_SIZE = 100;

    it('주식이 존재하지 않을 경우 NotFoundException을 던집니다.', async () => {
      managerMock.exists.mockResolvedValue(false);

      await expect(
        stockDataService.getPaginated(StockMinutely, stockId),
      ).rejects.toThrow('stock not found');
    });

    it('주식 데이터를 페이지네이션하여 가져옵니다. hasMore=true', async () => {
      const mockData: any[] = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => ({
        id: i,
        close: 100 + i,
        low: 90 + i,
        high: 110 + i,
        open: 95 + i,
        volume: 1000 + i * 10,
        startTime: new Date(
          `2023-11-${(10 + (i % 20)).toString().padStart(2, '0')}`,
        ),
        stock: { id: stockId } as Stock,
        createdAt: new Date(),
      }));

      const queryBuilderMock = createQueryBuilderMock(mockData);
      (managerMock.createQueryBuilder as jest.Mock).mockReturnValue(
        queryBuilderMock,
      );

      const response: StockDataResponse = await stockDataService.getPaginated(
        StockMinutely,
        stockId,
      );

      expect(managerMock.createQueryBuilder).toHaveBeenCalledWith(
        StockMinutely,
        'entity',
      );
      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'entity.stock_id = :stockId',
        { stockId },
      );
      expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
        'entity.startTime',
        'DESC',
      );
      expect(queryBuilderMock.take).toHaveBeenCalledWith(PAGE_SIZE + 1);
      expect(response.hasMore).toBe(true);
      expect(response.priceDtoList).toHaveLength(PAGE_SIZE);
      expect(response.volumeDtoList).toHaveLength(PAGE_SIZE);
    });

    it('주식 데이터를 페이지네이션하여 가져옵니다. hasMore=false', async () => {
      const mockData: any[] = Array.from({ length: PAGE_SIZE }, (_, i) => ({
        id: i,
        close: 100 + i,
        low: 90 + i,
        high: 110 + i,
        open: 95 + i,
        volume: 1000 + i * 10,
        startTime: new Date(
          `2023-11-${(10 + (i % 20)).toString().padStart(2, '0')}`,
        ),
        stock: { id: stockId } as Stock,
        createdAt: new Date(),
      }));

      const queryBuilderMock = createQueryBuilderMock(mockData);
      (managerMock.createQueryBuilder as jest.Mock).mockReturnValue(
        queryBuilderMock,
      );

      const response: StockDataResponse = await stockDataService.getPaginated(
        StockMinutely,
        stockId,
      );

      expect(response.hasMore).toBe(false);
      expect(response.priceDtoList).toHaveLength(PAGE_SIZE);
      expect(response.volumeDtoList).toHaveLength(PAGE_SIZE);
    });

    it('lastStartTime을 사용해 이전 데이터까지 페이지네이션 가져오기', async () => {
      const lastStartTime = '2023-11-15';
      const mockData: any[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        close: 100 + i,
        low: 90 + i,
        high: 110 + i,
        open: 95 + i,
        volume: 1000 + i * 10,
        startTime: new Date(
          `2023-11-${(15 - (i % 15)).toString().padStart(2, '0')}`,
        ),
        stock: { id: stockId } as Stock,
        createdAt: new Date(),
      }));

      const queryBuilderMock = createQueryBuilderMock(mockData);
      (managerMock.createQueryBuilder as jest.Mock).mockReturnValue(
        queryBuilderMock,
      );

      const response: StockDataResponse = await stockDataService.getPaginated(
        StockMinutely,
        stockId,
        lastStartTime,
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'entity.startTime < :lastStartTime',
        { lastStartTime },
      );
      expect(response.hasMore).toBe(false);
      expect(response.priceDtoList).toHaveLength(50);
      expect(response.volumeDtoList).toHaveLength(50);
    });

    it('쿼리에서 예외가 발생하면 예외를 던집니다.', async () => {
      const queryBuilderMock = createQueryBuilderMock([], true);
      (managerMock.createQueryBuilder as jest.Mock).mockReturnValue(
        queryBuilderMock,
      );

      await expect(
        stockDataService.getPaginated(StockMinutely, stockId),
      ).rejects.toThrow('Query error');
    });
  });

  describe('mapResultListToPriceDtoList', () => {
    it('StockData 목록을 PriceDto 목록으로 매핑합니다.', () => {
      const resultList = [
        {
          id: 2,
          startTime: new Date('2023-11-11T00:00:00Z'),
          open: 105,
          close: 115,
          high: 120,
          low: 100,
          volume: 600,
          stock: { id: stockId } as Stock,
          createdAt: new Date(),
        },
        {
          id: 1,
          startTime: new Date('2023-11-10T00:00:00Z'),
          open: 100,
          close: 110,
          high: 115,
          low: 95,
          volume: 500,
          stock: { id: stockId } as Stock,
          createdAt: new Date(),
        },
      ];

      const priceDtoList: PriceDto[] =
        stockDataService.mapResultListToPriceDtoList(resultList);

      expect(priceDtoList).toEqual([
        {
          startTime: new Date('2023-11-10T00:00:00Z'),
          open: 100,
          close: 110,
          high: 115,
          low: 95,
        },
        {
          startTime: new Date('2023-11-11T00:00:00Z'),
          open: 105,
          close: 115,
          high: 120,
          low: 100,
        },
      ]);
    });
  });

  describe('mapResultListToVolumeDtoList', () => {
    it('StockData 목록을 VolumeDto 목록으로 매핑합니다.', () => {
      const resultList = [
        {
          id: 3,
          startTime: new Date('2023-11-12T00:00:00Z'),
          close: 110,
          low: 95,
          high: 125,
          open: 115,
          volume: 550,
          stock: { id: stockId } as Stock,
          createdAt: new Date(),
        },
        {
          id: 2,
          startTime: new Date('2023-11-11T00:00:00Z'),
          close: 105,
          low: 100,
          high: 120,
          open: 115,
          volume: 600,
          stock: { id: stockId } as Stock,
          createdAt: new Date(),
        },
        {
          id: 1,
          startTime: new Date('2023-11-10T00:00:00Z'),
          close: 100,
          low: 90,
          high: 110,
          open: 95,
          volume: 500,
          stock: { id: stockId } as Stock,
          createdAt: new Date(),
        },
      ];

      const volumeDtoList: VolumeDto[] =
        stockDataService.mapResultListToVolumeDtoList(resultList);

      expect(volumeDtoList).toEqual([
        {
          startTime: new Date('2023-11-10T00:00:00Z'),
          volume: 500,
        },

        {
          startTime: new Date('2023-11-11T00:00:00Z'),
          volume: 600,
        },
        {
          startTime: new Date('2023-11-12T00:00:00Z'),
          volume: 550,
        },
      ]);
    });
  });

  describe('createStockDataResponse', () => {
    it('PriceDto와 VolumeDto 목록을 포함한 StockDataResponse 객체를 생성합니다.', () => {
      const priceDtoList: PriceDto[] = [
        {
          startTime: new Date('2023-11-11T00:00:00Z'),
          open: 105,
          close: 115,
          high: 120,
          low: 100,
        },
        {
          startTime: new Date('2023-11-10T00:00:00Z'),
          open: 100,
          close: 110,
          high: 115,
          low: 95,
        },
      ];

      const volumeDtoList: VolumeDto[] = [
        {
          startTime: new Date('2023-11-12T00:00:00Z'),
          volume: 550,
        },
        {
          startTime: new Date('2023-11-11T00:00:00Z'),
          volume: 600,
        },
        {
          startTime: new Date('2023-11-10T00:00:00Z'),
          volume: 500,
        },
      ];

      const response: StockDataResponse =
        stockDataService.createStockDataResponse(
          priceDtoList,
          volumeDtoList,
          true,
        );

      expect(response).toHaveProperty('priceDtoList');
      expect(response).toHaveProperty('volumeDtoList');
      expect(response.hasMore).toBe(true);
      expect(response.priceDtoList).toEqual(
        plainToInstance(PriceDto, priceDtoList),
      );
      expect(response.volumeDtoList).toEqual(
        plainToInstance(VolumeDto, volumeDtoList),
      );
    });
  });
});

class StockDataMinutelyService extends StockDataService {
  async getStockDataMinutely(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.getPaginated(StockMinutely, stock_id, lastStartTime);
  }
}

class StockDataDailyService extends StockDataService {
  async getStockDataDaily(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.getPaginated(StockDaily, stock_id, lastStartTime);
  }
}

class StockDataWeeklyService extends StockDataService {
  async getStockDataWeekly(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.getPaginated(StockWeekly, stock_id, lastStartTime);
  }
}

class StockDataMonthlyService extends StockDataService {
  async getStockDataMonthly(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.getPaginated(StockMonthly, stock_id, lastStartTime);
  }
}

class StockDataYearlyService extends StockDataService {
  async getStockDataYearly(
    stock_id: string,
    lastStartTime?: string,
  ): Promise<StockDataResponse> {
    return await this.getPaginated(StockYearly, stock_id, lastStartTime);
  }
}

describe('StockDataService 파생 클래스 테스트', () => {
  const stockId = 'A005930';
  let dataSource: Partial<DataSource>;
  let managerMock: any;

  beforeEach(() => {
    managerMock = {
      createQueryBuilder: jest.fn(),
      // 필요한 다른 메서드들도 여기에 추가할 수 있습니다.
    };
    dataSource = createDataSourceMock(managerMock);
  });

  const testDerivedService = (
    ServiceClass: any,
    EntityClass: any,
    methodName: string,
  ) => {
    describe(`${ServiceClass.name}`, () => {
      let service: any;

      beforeEach(() => {
        service = new ServiceClass(dataSource as DataSource);
      });

      it(`${methodName} 메서드가 getPaginated를 호출하고 올바른 엔티티를 전달합니다.`, async () => {
        const mockResponse: StockDataResponse = {
          priceDtoList: [],
          volumeDtoList: [],
          hasMore: false,
        };

        const getPaginatedSpy = jest
          .spyOn(StockDataService.prototype, 'getPaginated')
          .mockResolvedValue(mockResponse);

        const response = await service[methodName](stockId);

        expect(getPaginatedSpy).toHaveBeenCalledWith(
          EntityClass,
          stockId,
          undefined,
        );
        expect(response).toBe(mockResponse);

        getPaginatedSpy.mockRestore();
      });

      it(`${methodName} 메서드에 lastStartTime을 전달합니다.`, async () => {
        const lastStartTime = '2023-11-15';
        const mockResponse: StockDataResponse = {
          priceDtoList: [],
          volumeDtoList: [],
          hasMore: false,
        };

        const getPaginatedSpy = jest
          .spyOn(StockDataService.prototype, 'getPaginated')
          .mockResolvedValue(mockResponse);

        const response = await service[methodName](stockId, lastStartTime);

        expect(getPaginatedSpy).toHaveBeenCalledWith(
          EntityClass,
          stockId,
          lastStartTime,
        );
        expect(response).toBe(mockResponse);

        getPaginatedSpy.mockRestore();
      });
    });
  };

  testDerivedService(
    StockDataMinutelyService,
    StockMinutely,
    'getStockDataMinutely',
  );
  testDerivedService(StockDataDailyService, StockDaily, 'getStockDataDaily');
  testDerivedService(StockDataWeeklyService, StockWeekly, 'getStockDataWeekly');
  testDerivedService(
    StockDataMonthlyService,
    StockMonthly,
    'getStockDataMonthly',
  );
  testDerivedService(StockDataYearlyService, StockYearly, 'getStockDataYearly');
});
