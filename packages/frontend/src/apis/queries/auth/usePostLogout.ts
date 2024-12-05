import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostLogout, PostLogoutSchema } from './schema';
import { post } from '@/apis/utils/post';

const postLogout = () =>
  post<PostLogout>({
    schema: PostLogoutSchema,
    url: '/api/auth/logout',
  });

export const usePostLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: postLogout,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['loginStatus'] }),
  });
};
