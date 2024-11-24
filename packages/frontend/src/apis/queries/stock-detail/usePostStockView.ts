import { useMutation } from '@tanstack/react-query';
import {
  PostViewResponseSchema,
  type PostStockViewRequest,
  type PostViewResponse,
} from './schema';
import { post } from '@/apis/utils/post';

const postStockView = async ({ stockId }: PostStockViewRequest) =>
  post<PostViewResponse>({
    params: stockId,
    schema: PostViewResponseSchema,
    url: 'api/stock/view',
  });

export const usePostStockView = () => {
  return useMutation({
    mutationKey: ['stockView'],
    mutationFn: ({ stockId }: PostStockViewRequest) =>
      postStockView({ stockId }),
  });
};
