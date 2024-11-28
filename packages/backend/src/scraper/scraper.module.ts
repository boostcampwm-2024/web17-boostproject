import { Module } from '@nestjs/common';
import { KoreaStockInfoModule } from './korea-stock-info/korea-stock-info.module';
import { OpenapiScraperModule } from './openapi/openapi-scraper.module';

@Module({
  imports: [KoreaStockInfoModule, OpenapiScraperModule],
  controllers: [],
  providers: [],
  exports: [OpenapiScraperModule],
})
export class ScraperModule {}
