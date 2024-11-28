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
  timeunit,
}: StockTimeSeriesRequest) =>
  get<StockTimeSeriesResponse>({
    schema: StockTimeSeriesResponseSchema,
    url: `/api/stock/${stockId}`,
    params: {
      lastStartTime,
      timeunit,
    },
  });

export const useGetStocksPriceSeries = ({
  stockId,
  lastStartTime,
  timeunit,
}: StockTimeSeriesRequest) => {
  return useQuery({
    queryKey: ['stocksTimeSeries', stockId, lastStartTime, timeunit],
    queryFn: () => getStocksPriceSeries({ stockId, lastStartTime, timeunit }),
  });
};
