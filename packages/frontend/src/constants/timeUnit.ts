import { StockTimeSeriesRequest } from '@/apis/queries/stocks';

export const TIME_UNIT: Array<{
  id: number;
  time: StockTimeSeriesRequest['timeunit'];
  label: string;
}> = [
  { id: 1, time: 'day', label: '일' },
  { id: 2, time: 'week', label: '주' },
  { id: 3, time: 'month', label: '월' },
  { id: 4, time: 'year', label: '년' },
];
