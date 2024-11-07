import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeormConfig } from '@/configs/typeorm.config';
import { StockModule } from '@/stock/stock.module';

@Module({
  imports: [StockModule, TypeOrmModule.forRoot(typeormConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
