import { useQuery } from '@tanstack/react-query';
import {
  GetStockListResponseSchema,
  type GetStockListRequest,
  type GetStockListResponse,
} from './schema';
import { get } from '@/apis/utils/get';

const getTopGainers = ({ limit }: Partial<GetStockListRequest>) =>
  get<GetStockListResponse[]>({
    schema: GetStockListResponseSchema,
    url: `/api/stock/topGainers`,
    params: { limit },
  });

const getTopLosers = ({ limit }: Partial<GetStockListRequest>) =>
  get<GetStockListResponse[]>({
    schema: GetStockListResponseSchema,
    url: `/api/stock/topLosers`,
    params: { limit },
  });

export const useGetStocksByPrice = ({
  limit,
  sortType,
}: GetStockListRequest) => {
  return useQuery({
    queryKey: ['stocks', sortType],
    queryFn:
      sortType === 'increase'
        ? () => getTopGainers({ limit })
        : () => getTopLosers({ limit }),
  });
};
