import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { AuthModule } from '@/auth/auth.module';
import { logger } from '@/configs/logger.config';
import {
  typeormDevelopConfig,
  typeormProductConfig,
} from '@/configs/devTypeormConfig';
import { StockModule } from '@/stock/stock.module';
import { UserModule } from '@/user/user.module';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [
    ScraperModule,
    StockModule,
    UserModule,
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? typeormProductConfig
        : typeormDevelopConfig,
    ),
    WinstonModule.forRoot(logger),
    AuthModule,
    ScraperModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

