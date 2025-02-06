import { NewsItemDto } from './newsItemDto';

export class NewsInfoDto {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NewsItemDto[];
}
