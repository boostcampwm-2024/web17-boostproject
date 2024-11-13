import { Test, TestingModule } from '@nestjs/testing';
import { KoreaStockInfoController } from './korea-stock-info.controller';

describe('KoreaStockInfoController', () => {
  let controller: KoreaStockInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KoreaStockInfoController],
    }).compile();

    controller = module.get<KoreaStockInfoController>(KoreaStockInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
