import { NewsItemDto } from '@/crawling/dto/newsItemDto';

export class NewsInfoDto {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NewsItemDto[];
}
