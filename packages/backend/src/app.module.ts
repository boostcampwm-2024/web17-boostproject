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

@Module({
  imports: [
    //OpenapiScraperModule,
    //StockPriceModule,
    StockModule,
    UserModule,
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? typeormProductConfig
        : typeormDevelopConfig,
    ),
    WinstonModule.forRoot(logger),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
