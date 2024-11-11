import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@/auth/auth.module';
import { logger } from '@/configs/logger.config';
import { typeormConfig } from '@/configs/typeorm.config';
import { StockModule } from '@/stock/stock.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    StockModule,
    UserModule,
    TypeOrmModule.forRoot(typeormConfig),
    WinstonModule.forRoot(logger),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
