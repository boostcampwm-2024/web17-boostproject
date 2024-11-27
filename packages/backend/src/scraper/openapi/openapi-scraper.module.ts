import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenapiDetailData } from './api/openapiDetailData.api';
import { OpenapiMinuteData } from './api/openapiMinuteData.api';
import { OpenapiPeriodData } from './api/openapiPeriodData.api';
import { OpenapiTokenApi } from './api/openapiToken.api';
import { OpenapiScraperService } from './openapi-scraper.service';
import { OpenapiFluctuationData } from '@/scraper/openapi/api/openapiFluctuationData.api';
import { OpenapiRankViewApi } from '@/scraper/openapi/api/openapiRankView.api';
import { FluctuationRankStock } from '@/stock/domain/FluctuationRankStock.entity';
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
      FluctuationRankStock,
    ]),
  ],
  controllers: [],
  providers: [
    OpenapiTokenApi,
    OpenapiPeriodData,
    OpenapiMinuteData,
    OpenapiDetailData,
    OpenapiScraperService,
    OpenapiFluctuationData,
    OpenapiRankViewApi,
  ],
})
export class OpenapiScraperModule {}
