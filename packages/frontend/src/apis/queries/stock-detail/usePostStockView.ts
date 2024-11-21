import type { PostStockViewRequest, PostStockViewResponse } from './types';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { instance } from '@/apis/config';

const postStockView = async ({
  stockId,
}: PostStockViewRequest): Promise<PostStockViewResponse> => {
  const { data } = await instance.post('/api/stock/view', { stockId });
  return data;
};

export const usePostStockView = (
  options?: UseMutationOptions<PostStockViewResponse, Error, string>,
) => {
  return useMutation<PostStockViewResponse, Error, string>({
    mutationKey: ['stock_view'],
    mutationFn: (stockId) => postStockView({ stockId }),
    ...options,
  });
};
