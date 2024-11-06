import { Module } from '@nestjs/common';
import { StockPriceModule } from './stock-price/stock-price.module';
import { OpenapiScraperModule } from './openapi-scraper/openapi-scraper.module';

@Module({
  imports: [OpenapiScraperModule, StockPriceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
