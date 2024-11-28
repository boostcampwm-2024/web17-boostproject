import { useQuery } from '@tanstack/react-query';
import {
  GetStockListResponseSchema,
  type GetStockListRequest,
  type GetStockListResponse,
} from './schema';
import { get } from '@/apis/utils/get';

const getStockByPrice = ({ limit }: Partial<GetStockListRequest>) =>
  get<GetStockListResponse>({
    schema: GetStockListResponseSchema,
    url: `/api/stock/fluctuation`,
    params: { limit },
  });

export const useGetStocksByPrice = ({ limit }: GetStockListRequest) => {
  return useQuery({
    queryKey: ['stocks', limit],
    queryFn: () => getStockByPrice({ limit }),
  });
};
