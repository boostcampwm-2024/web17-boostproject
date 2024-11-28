import { useMutation } from '@tanstack/react-query';
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
  return useMutation({
    mutationKey: ['chatLike'],
    mutationFn: ({ chatId }: GetChatLikeRequest) => postChatLike({ chatId }),
  });
};
