import { Module } from '@nestjs/common';
import { OpenapiMinuteData } from './api/openapiMinuteData.api';
import { OpenapiPeriodData } from './api/openapiPeriodData.api';
import { OpenapiScraperService } from './openapi-scraper.service';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from '@/stock/domain/stock.entity';
import { StockDaily, StockMinutely, StockMonthly, StockWeekly, StockYearly } from '@/stock/domain/stockData.entity';
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';
import { StockDetail } from '@/stock/domain/stockDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, StockMinutely , StockDaily, StockWeekly, StockMonthly, StockYearly, StockLiveData, StockDetail])],
  controllers: [],
  providers: [OpenapiPeriodData, OpenapiMinuteData, OpenapiScraperService],
})
export class OpenapiScraperModule {}
