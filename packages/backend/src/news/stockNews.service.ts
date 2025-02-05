import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockNews } from '@/news/domain/stockNews.entity';
import { CreateStockNewsDto } from '@/news/dto/stockNews.dto';

@Injectable()
export class StockNewsService {
  constructor(
    @InjectRepository(StockNews)
    private readonly stockNewsRepository: Repository<StockNews>,
  ) {}

  async create(dto: CreateStockNewsDto): Promise<StockNews> {
    const stockNews = new StockNews();
    stockNews.stockId = dto.stock_id;
    stockNews.stockName = dto.stock_name;
    stockNews.link = dto.link;
    stockNews.title = dto.title;
    stockNews.summary = dto.summary;
    stockNews.positiveContent = dto.positive_content;
    stockNews.negativeContent = dto.negative_content;

    return await this.stockNewsRepository.save(stockNews);
  }

  async findByStockId(stockId: string): Promise<StockNews[]> {
    return await this.stockNewsRepository.find({
      where: { stockId },
      order: { createdAt: 'DESC' },
    });
  }

  async findLatestByStockId(stockId: string): Promise<StockNews | null> {
    return await this.stockNewsRepository.findOne({
      where: { stockId },
      order: { createdAt: 'DESC' },
    });
  }
}