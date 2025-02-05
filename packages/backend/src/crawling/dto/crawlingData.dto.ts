import { CrawlNewsItemDto } from '@/crawling/dto/crawlNewsItem.dto';

export class CrawlingDataDto {
  stockName: string;
  news: CrawlNewsItemDto[];
}
