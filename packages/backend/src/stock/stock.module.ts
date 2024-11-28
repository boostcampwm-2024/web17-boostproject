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
import { AlarmModule } from '@/alarm/alarm.module';
import { Alarm } from '@/alarm/domain/alarm.entity';
import { ScraperModule } from '@/scraper/scraper.module';
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
  ],
  controllers: [StockController],
  providers: [
    StockService,
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
