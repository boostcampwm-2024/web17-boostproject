import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockNewsService } from '@/news/stockNews.service';
import { CreateStockNewsDto, StockNewsResponse } from '@/news/dto/stockNews.dto';

@ApiTags('Stock News')
@Controller('stock/news')
export class StockNewsController {
  constructor(private readonly stockNewsService: StockNewsService) {}

  @Post()
  @ApiOperation({ summary: '주식 뉴스 정보 저장' })
  @ApiResponse({ status: 201, type: StockNewsResponse })
  async create(@Body() createStockNewsDto: CreateStockNewsDto) {
    const stockNews = await this.stockNewsService.create(createStockNewsDto);
    return new StockNewsResponse(stockNews);
  }

  @Get(':stockId')
  @ApiOperation({ summary: '종목별 뉴스 조회' })
  @ApiResponse({ status: 200, type: [StockNewsResponse] })
  async findByStockId(@Param('stockId') stockId: string) {
    const newsList = await this.stockNewsService.findByStockId(stockId);
    return newsList.map(news => new StockNewsResponse(news));
  }

  @Get(':stockId/latest')
  @ApiOperation({ summary: '종목별 최신 뉴스 조회' })
  @ApiResponse({ status: 200, type: StockNewsResponse })
  async findLatestByStockId(@Param('stockId') stockId: string) {
    const news = await this.stockNewsService.findLatestByStockId(stockId);
    return news ? new StockNewsResponse(news) : null;
  }
}