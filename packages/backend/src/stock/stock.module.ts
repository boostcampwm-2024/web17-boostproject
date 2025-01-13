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
import { StockDetailService } from './stockDetail.service';
import { StockLiveDataSubscriber } from './stockLiveData.subscriber';
import { StockRateIndexService } from './stockRateIndex.service';
import { AlarmModule } from '@/alarm/alarm.module';
import { Alarm } from '@/alarm/domain/alarm.entity';
import { OpenapiScraperModule } from '@/scraper/openapi/openapi-scraper.module';
import { ScraperModule } from '@/scraper/scraper.module';
import { StockDataCache } from '@/stock/cache/stockData.cache';
import { StockDataService } from '@/stock/stockData.service';
import { GainersSortStrategy, LosersSortStrategy, ViewsSortStrategy } from '@/stock/strategy/StockSortStrategy';

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
      Alarm,
    ]),
    AlarmModule,
    ScraperModule,
    OpenapiScraperModule,
  ],
  controllers: [StockController],
  providers: [
    StockDataCache,
    StockService,
    StockGateway,
    StockLiveDataSubscriber,
    StockDataService,
    StockDetailService,
    StockRateIndexService,
    ViewsSortStrategy,
    GainersSortStrategy,
    LosersSortStrategy
  ],
  exports: [StockService],
})
export class StockModule {}
