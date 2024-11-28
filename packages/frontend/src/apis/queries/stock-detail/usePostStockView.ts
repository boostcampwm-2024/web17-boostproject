import { useMutation } from '@tanstack/react-query';
import {
  PostStockResponseSchema,
  type PostStockRequest,
  type PostStockResponse,
} from './schema';
import { post } from '@/apis/utils/post';

const postStockView = ({ stockId }: PostStockRequest) =>
  post<PostStockResponse>({
    params: { stockId },
    schema: PostStockResponseSchema,
    url: '/api/stock/view',
  });

export const usePostStockView = () => {
  return useMutation({
    mutationKey: ['stockView'],
    mutationFn: ({ stockId }: PostStockRequest) => postStockView({ stockId }),
  });
};
