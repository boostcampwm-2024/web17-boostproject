import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { StockPriceModule } from './stock-price/stock-price.module';
import { OpenapiScraperModule } from './openapi-scraper/openapi-scraper.module';
import { logger } from '@/configs/logger.config';
import { typeormConfig } from '@/configs/typeorm.config';
import { StockModule } from '@/stock/stock.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    WinstonModule.forRoot(logger),
    StockModule,
    UserModule,
    OpenapiScraperModule,
    StockPriceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
