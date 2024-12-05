import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostUserNickname, PostUserNicknameSchema } from './schema';
import { post } from '@/apis/utils/post';

const postUserNickname = ({ nickname }: { nickname: string }) =>
  post<PostUserNickname>({
    params: { nickname },
    schema: PostUserNicknameSchema,
    url: '/api/user/info',
  });

export const usePostUserNickname = ({ nickname }: { nickname: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['userNickname'],
    mutationFn: () => postUserNickname({ nickname }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userInfo'] }),
  });
};
