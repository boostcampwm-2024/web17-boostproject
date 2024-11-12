import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { logger } from '@/configs/logger.config';
import { typeormConfig } from '@/configs/typeorm.config';
import { StockModule } from '@/stock/stock.module';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { OpenapiScraperModule } from '@/openapi-scraper/openapi-scraper.module';
import { StockPriceModule } from '@/stock-price/stock-price.module';

@Module({
  imports: [
    //OpenapiScraperModule,
    StockPriceModule,
    StockModule,
    UserModule,
    TypeOrmModule.forRoot(typeormConfig),
    WinstonModule.forRoot(logger),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
