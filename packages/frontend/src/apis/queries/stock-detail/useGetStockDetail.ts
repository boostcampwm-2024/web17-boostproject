import { useQuery } from '@tanstack/react-query';
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
  return useQuery({
    queryKey: ['stockDetail', stockId],
    queryFn: () => getStockDetail({ stockId }),
    enabled: !!stockId,
  });
};
