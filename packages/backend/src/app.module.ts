import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockPriceModule } from './stock-price/stock-price.module';
import { OpenapiScraperModule } from './openapi-scraper/openapi-scraper.module';
import { typeormConfig } from '@/configs/typeorm.config';
import { StockModule } from '@/stock/stock.module';

@Module({
  imports: [StockModule, 
    TypeOrmModule.forRoot(typeormConfig),
    OpenapiScraperModule,
    StockPriceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
