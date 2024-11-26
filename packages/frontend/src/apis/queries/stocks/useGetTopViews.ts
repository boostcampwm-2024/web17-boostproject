import { useQuery } from '@tanstack/react-query';
import {
  GetStockListResponseSchema,
  type GetStockListRequest,
  type GetStockListResponse,
} from './schema';
import { get } from '@/apis/utils/get';

const getTopViews = ({ limit }: Partial<GetStockListRequest>) =>
  get<GetStockListResponse[]>({
    schema: GetStockListResponseSchema,
    url: `/api/stock/topViews`,
    params: { limit },
  });

export const useGetTopViews = ({ limit }: Partial<GetStockListRequest>) => {
  return useQuery({
    queryKey: ['stocks', 'topViews'],
    queryFn: () => getTopViews({ limit }),
  });
};
