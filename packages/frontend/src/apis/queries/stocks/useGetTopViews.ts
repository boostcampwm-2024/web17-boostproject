import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import {
  GetStockListResponseSchema,
  GetStockTopViewsResponse,
  type GetStockListRequest,
} from './schema';
import { get } from '@/apis/utils/get';

const getTopViews = ({ limit }: Partial<GetStockListRequest>) =>
  get<Partial<GetStockTopViewsResponse>[]>({
    schema: z.array(GetStockListResponseSchema.partial()),
    url: `/api/stock/topViews`,
    params: { limit },
  });

export const useGetTopViews = ({ limit }: Partial<GetStockListRequest>) => {
  return useQuery({
    queryKey: ['stocks', 'topViews'],
    queryFn: () => getTopViews({ limit }),
  });
};
