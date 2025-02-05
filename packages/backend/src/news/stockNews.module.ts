import { TypeOrmModule } from '@nestjs/typeorm';
import { StockNews } from '@/news/domain/stockNews.entity';
import { StockNewsController } from '@/news/stockNews.controller';
import { Module } from '@nestjs/common';
import { StockNewsService } from '@/news/stockNews.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockNews])],
  controllers: [StockNewsController],
  providers: [StockNewsService],
  exports: [StockNewsService],
})

export class StockNewsModule {}