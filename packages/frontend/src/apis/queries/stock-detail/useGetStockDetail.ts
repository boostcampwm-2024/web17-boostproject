import { useSuspenseQuery } from '@tanstack/react-query';
import {
  GetStockResponseSchema,
  type GetStockRequest,
  type GetStockResponse,
} from './schema';
import { get } from '@/apis/utils/get';

const getStockDetail = ({ stockId }: GetStockRequest) =>
  get<GetStockResponse>({
    schema: GetStockResponseSchema,
    url: `/api/stock/${stockId}/detail`,
  });

export const useGetStockDetail = ({ stockId }: GetStockRequest) => {
  return useSuspenseQuery({
    queryKey: ['stockDetail', stockId],
    queryFn: () => getStockDetail({ stockId }),
    staleTime: 1000 * 60 * 5,
  });
};
