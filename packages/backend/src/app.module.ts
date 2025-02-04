import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { ScraperModule } from './scraper/scraper.module';
import { AuthModule } from '@/auth/auth.module';
import { SessionModule } from '@/auth/session.module';
import { ChatModule } from '@/chat/chat.module';
import { logger } from '@/configs/logger.config';
import {
  typeormDevelopConfig,
  typeormProductConfig,
} from '@/configs/typeormConfig';
import { StockModule } from '@/stock/stock.module';
import { UserModule } from '@/user/user.module';
import { StockNewsModule } from '@/news/stockNews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    ScheduleModule.forRoot(),
    WinstonModule.forRoot(logger),
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? typeormProductConfig
        : typeormDevelopConfig,
    ),
    ScraperModule,
    StockModule,
    UserModule,
    AuthModule,
    ChatModule,
    SessionModule,
    StockNewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
