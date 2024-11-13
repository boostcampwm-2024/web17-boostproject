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
import { StockLiveDataSubscriber } from './stockLiveData.subscriber';

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
    ]),
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
  ],
})
export class StockModule {}
