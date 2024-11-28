import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { ScraperModule } from './scraper/scraper.module';
import { AuthModule } from '@/auth/auth.module';
import { SessionModule } from '@/auth/session.module';
import { ChatModule } from '@/chat/chat.module';
import {
  typeormDevelopConfig,
  typeormProductConfig,
} from '@/configs/typeormConfig';
import { logger } from '@/configs/logger.config';
import { StockModule } from '@/stock/stock.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    ScheduleModule.forRoot(),
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
    ChatModule,
    SessionModule,
    ScraperModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
