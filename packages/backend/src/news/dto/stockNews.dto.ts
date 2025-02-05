import { IsString, MaxLength } from 'class-validator';
import { StockNews } from '@/news/domain/stockNews.entity';

export class CreateStockNewsDto {
  @IsString()
  stock_id: string;

  @IsString()
  stock_name: string;

  @IsString()
  link: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(10000)
  summary: string;

  @IsString()
  positive_content: string;

  @IsString()
  negative_content: string;
}

export class StockNewsResponse {
  constructor(stockNews: StockNews) {
    this.stockId = stockNews.stockId;
    this.stockName = stockNews.stockName;
    this.link = stockNews.link;
    this.title = stockNews.title;
    this.summary = stockNews.summary;
    this.positiveContent = stockNews.positiveContent;
    this.negativeContent = stockNews.negativeContent;
    this.createdAt = stockNews.createdAt;
  }

  stockId: string;
  stockName: string;
  link: string;
  title: string;
  summary: string;
  positiveContent: string;
  negativeContent: string;
  createdAt: Date;
}