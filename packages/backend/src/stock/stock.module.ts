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
import { OpenapiLiveData } from '@/scraper/openapi/api/openapiLiveData.api';
import { OpenapiTokenApi } from '@/scraper/openapi/api/openapiToken.api';
import { LiveData } from '@/scraper/openapi/liveData.service';
import { WebsocketClient } from '@/scraper/openapi/websocket/websocketClient.websocket';

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
  ],
  controllers: [StockController],
  providers: [
    StockService,
    WebsocketClient,
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
