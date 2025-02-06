import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { NewsCrawlingService } from '@/news/newsCrawling.service';
import { NewsSummaryService } from '@/news/newsSummary.service';
import { StockNewsRepository } from '@/news/stockNews.repository';
import { CrawlingDataDto } from '@/news/dto/crawlingData.dto';
import { Cron } from '@nestjs/schedule';
import { CreateStockNewsDto } from '@/news/dto/stockNews.dto';

@Injectable()
export class StockNewsOrchestrationService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly newsCrawlingService: NewsCrawlingService,
    private readonly newsSummaryService: NewsSummaryService,
    private readonly stockNewsRepository: StockNewsRepository,
  ) {}

  @Cron('19 15 0 * * *') //오후 3시 19분
  public async orchestrateStockProcessing() {
    const stockNameList = [
      '삼성전자',
      // 'SK하이닉스',
      // 'LG에너지솔루션',
      // '삼성바이오로직스',
      // '현대차',
      // '기아',
      // '셀트리온',
      // 'NAVER',
      // 'KB금융',
      // 'HD현대중공업',
    ];
    // 주식 데이터 크롤링
    for (const stockName of stockNameList) {
      const stockDataList =
        await this.newsCrawlingService.getNewsLinks(stockName);

      const stockNewsData: CrawlingDataDto =
        await this.newsCrawlingService.crawling(
          stockDataList!.stock,
          stockDataList!.response,
        );
      // 데이터 요약
      const summarizedData =
        await this.newsSummaryService.summarizeNews(stockNewsData);

      console.log('summarizedData');
      console.log(summarizedData);

      // DB에 저장
      if (summarizedData) {
        await this.stockNewsRepository.create(summarizedData);
      } else {
        this.logger.error('Failed to summarize news');
      }
    }
  }
}
