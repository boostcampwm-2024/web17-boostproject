import { useQuery } from '@tanstack/react-query';
import {
  GetStockOwnershipResponseSchema,
  type GetStockRequest,
  type GetStockOwnershipResponse,
} from './schema';
import { get } from '@/apis/utils/get';

const getOwnership = ({ stockId }: GetStockRequest) =>
  get<GetStockOwnershipResponse>({
    schema: GetStockOwnershipResponseSchema,
    url: `/api/stock/user/ownership?stockId=${stockId}`,
  });

export const useGetOwnership = ({ stockId }: GetStockRequest) => {
  return useQuery({
    queryKey: ['stockDetail'],
    queryFn: () => getOwnership({ stockId }),
    enabled: !!stockId,
  });
};
