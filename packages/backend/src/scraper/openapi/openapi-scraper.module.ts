import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenapiToken } from '../domain/openapiToken.entity';
import { OpenapiDetailData } from './api/openapiDetailData.api';
import { OpenapiLiveData } from './api/openapiLiveData.api';
import { OpenapiMinuteData } from './api/openapiMinuteData.api';
import { OpenapiPeriodData } from './api/openapiPeriodData.api';
import { OpenapiTokenApi } from './api/openapiToken.api';
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
    OpenapiTokenApi,
    OpenapiPeriodData,
    OpenapiMinuteData,
    OpenapiDetailData,
    OpenapiScraperService,
    OpenapiLiveData,
    WebsocketClient,
  ],
  exports: [WebsocketClient],
})
export class OpenapiScraperModule {}
