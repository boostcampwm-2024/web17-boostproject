import { Test, TestingModule } from '@nestjs/testing';
import { KoreaStockInfoService } from './korea-stock-info.service';

describe('KoreaStockInfoService', () => {
  let service: KoreaStockInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KoreaStockInfoService],
    }).compile();

    service = module.get<KoreaStockInfoService>(KoreaStockInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
