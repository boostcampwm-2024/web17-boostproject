import { NotFoundException } from '@nestjs/common';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Logger } from 'winston';
import { StockDetail } from './domain/stockDetail.entity';
import { StockDetailService } from './stockDetail.service';
import { Stock } from '@/stock/domain/stock.entity';
import { StockDetailResponse } from '@/stock/dto/stockDetail.response';

describe('StockDetailService 테스트', () => {
  const stockId = 'A005930';
  let stockDetailService: StockDetailService;
  let logger: Logger;
  let dataSourceMock: DataSource;
  let managerMock: EntityManager;
  let repositoryMock: Repository<StockDetail>;
  let queryBuilderMock: SelectQueryBuilder<StockDetail>;

  beforeEach(() => {
    dataSourceMock = mock(DataSource);
    logger = mock(Logger);
    managerMock = mock(EntityManager);
    repositoryMock = mock(Repository);
    queryBuilderMock = mock(SelectQueryBuilder);
    stockDetailService = new StockDetailService(
      instance(dataSourceMock),
      instance(logger),
    );
    when(dataSourceMock.transaction(anything())).thenCall(async (callback) => {
      return await callback(instance(managerMock));
    });
  });

  test('stockId로 주식 상세 정보를 조회한다.', async () => {
    const data = {
      id: 1,
      stock: { id: stockId } as Stock,
      marketCap: String(352510000000000),
      eps: 4091,
      per: 17.51,
      high52w: 88000,
      low52w: 53000,
      updatedAt: new Date(),
    };
    when(managerMock.existsBy(StockDetail, anything())).thenResolve(true);
    when(managerMock.getRepository(StockDetail)).thenReturn(
      instance(repositoryMock),
    );
    when(repositoryMock.createQueryBuilder(anything())).thenReturn(
      instance(queryBuilderMock),
    );
    when(queryBuilderMock.where(anyString(), anything())).thenReturn(
      instance(queryBuilderMock),
    );
    when(
      queryBuilderMock.leftJoinAndSelect(anyString(), anyString()),
    ).thenReturn(instance(queryBuilderMock));
    when(queryBuilderMock.getOne()).thenResolve(data);

    const result = await stockDetailService.getStockDetailByStockId(stockId);

    verify(managerMock.existsBy(StockDetail, anything())).once();
    verify(queryBuilderMock.getOne()).once();

    expect(result).toEqual(new StockDetailResponse(data));
  });

  test('존재하지 않는 stockId로 조회 시 예외를 발생시킨다.', async () => {
    when(managerMock.existsBy(StockDetail, anything())).thenResolve(false);

    await expect(
      stockDetailService.getStockDetailByStockId('nonexistentId'),
    ).rejects.toThrow(NotFoundException);
  });
});
