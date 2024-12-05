import { useSuspenseQueries } from '@tanstack/react-query';
import { z } from 'zod';
import {
  GetStockListRequest,
  GetStockListResponseSchema,
  GetStockTopViewsResponse,
  StockIndexResponse,
  StockIndexSchema,
} from './schema';
import { get } from '@/apis/utils/get';

interface StockQueriesProps {
  viewsLimit: GetStockListRequest['limit'];
}

const getStockIndex = () =>
  get<StockIndexResponse[]>({
    schema: z.array(StockIndexSchema),
    url: `/api/stock/index`,
  });

const getTopViews = ({ limit }: Partial<GetStockListRequest>) =>
  get<Partial<GetStockTopViewsResponse>[]>({
    schema: z.array(GetStockListResponseSchema.partial()),
    url: `/api/stock/topViews`,
    params: { limit },
  });

export const useStockQueries = ({ viewsLimit }: StockQueriesProps) => {
  return useSuspenseQueries({
    queries: [
      {
        queryKey: ['stockIndex'],
        queryFn: getStockIndex,
      },
      {
        queryKey: ['topViews'],
        queryFn: () => getTopViews({ limit: viewsLimit }),
      },
    ],
  });
};
