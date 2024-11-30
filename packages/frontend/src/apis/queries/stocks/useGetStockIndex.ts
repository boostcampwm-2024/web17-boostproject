import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { StockIndexSchema, type StockIndexResponse } from './schema';
import { get } from '@/apis/utils/get';

const getStockIndex = () =>
  get<StockIndexResponse[]>({
    schema: z.array(StockIndexSchema),
    url: `/api/stock/index`,
  });

export const useGetStockIndex = () => {
  return useQuery({
    queryKey: ['stockIndex'],
    queryFn: getStockIndex,
    staleTime: 1000 * 60,
  });
};
