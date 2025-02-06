import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockNewsService } from '@/news/stockNews.service';
import { StockNews } from '@/news/domain/stockNews.entity';
import { CreateStockNewsDto } from '@/news/dto/stockNews.dto';


describe('NewsService', () => {
  let service: StockNewsService;
  let repository: Repository<StockNews>;

  const mockNewsDto: CreateStockNewsDto = {
    stock_id: '005930',
    stock_name: '삼성전자',
    link: 'http://news1.com,http://news2.com',
    title: '삼성전자 실적 발표',
    summary: '삼성전자가 2024년 1분기 실적을 발표했다...',
    positive_content: '영업이익 증가',
    negative_content: '시장 불확실성 존재',
  };

  const mockNews = {
    id: 1,
    ...mockNewsDto,
    createdAt: new Date(),
    updatedAt: new Date(),
    getLinks: () => mockNewsDto.link.split(','),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockNewsService,
        {
          provide: getRepositoryToken(StockNews),
          useValue: {
            save: jest.fn().mockResolvedValue(mockNews),
            find: jest.fn().mockResolvedValue([mockNews]),
            findOne: jest.fn().mockResolvedValue(mockNews),
          },
        },
      ],
    }).compile();

    service = module.get<StockNewsService>(StockNewsService);
    repository = module.get<Repository<StockNews>>(getRepositoryToken(StockNews));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a news entry', async () => {
      const result = await service.create(mockNewsDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockNews);
    });
  });

  describe('findByStockId', () => {
    it('should return an array of news for a stock', async () => {
      const stockId = '005930';
      const result = await service.findByStockId(stockId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { stockId },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockNews]);
    });
  });

  describe('findLatestByStockId', () => {
    it('should return the latest news for a stock', async () => {
      const stockId = '005930';
      const result = await service.findLatestByStockId(stockId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { stockId },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockNews);
    });
  });
});