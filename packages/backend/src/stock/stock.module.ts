import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './domain/stock.entity';
import {
  StockDaily,
  StockMinutely,
  StockMonthly,
  StockWeekly,
  StockYearly,
} from './domain/stockData.entity';
import { StockDetail } from './domain/stockDetail.entity';
import { StockLiveData } from './domain/stockLiveData.entity';
import { StockController } from './stock.controller';
import { StockGateway } from './stock.gateway';
import { StockService } from './stock.service';
import {
  StockDataDailyService,
  StockDataMinutelyService,
  StockDataMonthlyService,
  StockDataService,
  StockDataWeeklyService,
  StockDataYearlyService,
} from './stockData.service';
import { StockDetailService } from './stockDetail.service';
import { StockLiveDataSubscriber } from './stockLiveData.subscriber';
import { StockRateIndexService } from './stockRateIndex.service';
import { OpenapiLiveData } from '@/scraper/openapi/api/openapiLiveData.api';
import { OpenapiTokenApi } from '@/scraper/openapi/api/openapiToken.api';
import { LiveData } from '@/scraper/openapi/liveData.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stock,
      StockMinutely,
      StockDaily,
      StockWeekly,
      StockMonthly,
      StockYearly,
      StockLiveData,
      StockDetail,
    ]),
  ],
  controllers: [StockController],
  providers: [
    StockService,
    OpenapiTokenApi,
    OpenapiLiveData,
    LiveData,
    StockGateway,
    StockLiveDataSubscriber,
    StockDataService,
    StockDataDailyService,
    StockDataMinutelyService,
    StockDataWeeklyService,
    StockDataYearlyService,
    StockDataMonthlyService,
    StockDetailService,
    StockRateIndexService,
  ],
  exports: [StockService],
})
export class StockModule {}
