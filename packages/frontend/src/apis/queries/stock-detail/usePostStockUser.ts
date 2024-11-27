import { useMutation } from '@tanstack/react-query';
import {
  PostStockResponseSchema,
  type PostStockRequest,
  type PostStockResponse,
} from './schema';
import { post } from '@/apis/utils/post';

const postStockUser = ({ stockId }: PostStockRequest) =>
  post<PostStockResponse>({
    params: { stockId },
    schema: PostStockResponseSchema,
    url: '/api/stock/user',
  });

export const usePostStockUser = ({ ...options }) => {
  return useMutation({
    mutationKey: ['addStock'],
    mutationFn: ({ stockId }: PostStockRequest) => postStockUser({ stockId }),
    ...options,
  });
};
