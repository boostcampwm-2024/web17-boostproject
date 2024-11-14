import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './domain/stock.entity';
import { StockController } from './stock.controller';
import { StockGateway } from './stock.gateway';
import { StockService } from './stock.service';
import { StockDetailService } from './stockDetail.service';
import { StockLiveDataSubscriber } from './stockLiveData.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [
    StockService,
    StockGateway,
    StockLiveDataSubscriber,
    StockDetailService,
  ],
})
export class StockModule {}
