import { Module } from '@nestjs/common';
import { OpenapiMinuteData } from './api/openapiMinuteData.api';
import { OpenapiPeriodData } from './api/openapiPeriodData.api';
import { OpenapiScraperService } from './openapi-scraper.service';

@Module({
  imports: [],
  controllers: [],
  providers: [OpenapiPeriodData, OpenapiMinuteData, OpenapiScraperService],
})
export class OpenapiScraperModule {}
