import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { KoreaStockInfoService } from './korea-stock-info.service';
import { logger } from '@/configs/logger.config';
import { Stock } from '@/stock/domain/stock.entity';

xdescribe('KoreaStockInfoService', () => {
  let service: KoreaStockInfoService;

  // 모듈을 사용하려면 직접 DB에 연결해야함
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Stock]),
        WinstonModule.forRoot(logger),
      ],
      providers: [KoreaStockInfoService],
    }).compile();

    service = module.get<KoreaStockInfoService>(KoreaStockInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
