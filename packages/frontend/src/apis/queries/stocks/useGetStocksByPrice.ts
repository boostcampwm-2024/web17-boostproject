import { useQuery } from '@tanstack/react-query';
import {
  GetStockListResponseSchema,
  type GetStockListRequest,
  type GetStockListResponse,
} from './schema';
import { get } from '@/apis/utils/get';

const getStockByPrice = ({ limit, type }: GetStockListRequest) =>
  get<GetStockListResponse>({
    schema: GetStockListResponseSchema,
    url: `/api/stock/fluctuation`,
    params: { limit, type },
  });

export const useGetStocksByPrice = ({ limit, type }: GetStockListRequest) => {
  return useQuery({
    queryKey: ['stocks', limit, type],
    queryFn: () => getStockByPrice({ limit, type }),
    staleTime: 1000 * 60,
  });
};
