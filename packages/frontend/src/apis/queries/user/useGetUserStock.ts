import { useSuspenseQuery } from '@tanstack/react-query';
import {
  GetUserStockResponseSchema,
  type GetUserStockResponse,
} from './schema';
import { get } from '@/apis/utils/get';

const getUserStock = () =>
  get<GetUserStockResponse>({
    schema: GetUserStockResponseSchema,
    url: '/api/stock/user',
  });

export const useGetUserStock = () => {
  return useSuspenseQuery({
    queryKey: ['userStock'],
    queryFn: getUserStock,
  });
};
