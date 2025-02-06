import { CrawlNewsItemDto } from './crawlNewsItem.dto';

export class CrawlingDataDto {
  stockName: string;
  news: CrawlNewsItemDto[];
}
