import { useInfiniteQuery } from '@tanstack/react-query';
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
  return useInfiniteQuery({
    queryKey: ['stocksTimeSeries', stockId, timeunit],
    queryFn: ({ pageParam }) =>
      getStocksPriceSeries({
        stockId,
        lastStartTime: pageParam?.lastStartTime ?? lastStartTime,
        timeunit,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore
        ? {
            lastStartTime: lastPage.priceDtoList[0].startTime,
          }
        : undefined,
    initialPageParam: { lastStartTime },
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};
