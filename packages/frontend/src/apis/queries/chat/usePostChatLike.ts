import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  GetChatLikeResponseSchema,
  type GetChatLikeRequest,
  type GetChatLikeResponse,
} from './schema';
import { post } from '@/apis/utils/post';

const postChatLike = ({ chatId }: GetChatLikeRequest) =>
  post<GetChatLikeResponse>({
    params: { chatId },
    schema: GetChatLikeResponseSchema,
    url: '/api/chat/like',
  });

export const usePostChatLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['chatLike'],
    mutationFn: ({ chatId }: GetChatLikeRequest) => postChatLike({ chatId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatLike'] });
    },
  });
};
