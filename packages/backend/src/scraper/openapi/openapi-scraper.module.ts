import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenapiDetailData } from './api/openapiDetailData.api';
import { OpenapiLiveData } from './api/openapiLiveData.api';
import { OpenapiMinuteData } from './api/openapiMinuteData.api';
import { OpenapiPeriodData } from './api/openapiPeriodData.api';
import { OpenapiScraperService } from './openapi-scraper.service';
import { WebsocketClient } from './websocketClient.service';
import { Stock } from '@/stock/domain/stock.entity';
import {
  StockDaily,
  StockMinutely,
  StockMonthly,
  StockWeekly,
  StockYearly,
} from '@/stock/domain/stockData.entity';
import { StockDetail } from '@/stock/domain/stockDetail.entity';
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';

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
  controllers: [],
  providers: [
    OpenapiPeriodData,
    OpenapiMinuteData,
    OpenapiDetailData,
    OpenapiScraperService,
    OpenapiLiveData,
    WebsocketClient,
  ],
})
export class OpenapiScraperModule {}
