import { useQuery } from '@tanstack/react-query';
import {
  StockTimeSeriesResponseSchema,
  type StockTimeSeriesRequest,
  type StockTimeSeriesResponse,
} from './schema';
import { get } from '@/apis/utils/get';

const getStocksPriceSeries = ({
  stockId,
  lastStartTime,
  timeUnit,
}: StockTimeSeriesRequest) =>
  get<StockTimeSeriesResponse>({
    schema: StockTimeSeriesResponseSchema,
    url: `/api/stock/${stockId}`,
    payload: {
      lastStartTime,
      timeUnit,
    },
  });

export const useGetStocksPriceSeries = ({
  stockId,
  lastStartTime,
  timeUnit,
}: StockTimeSeriesRequest) => {
  return useQuery({
    queryKey: ['stocksTimeSeries', stockId, lastStartTime, timeUnit],
    queryFn: () => getStocksPriceSeries({ stockId, lastStartTime, timeUnit }),
  });
};
