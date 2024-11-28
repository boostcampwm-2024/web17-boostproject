import { useMutation } from '@tanstack/react-query';
import { PostLogout, PostLogoutSchema } from './schema';
import { post } from '@/apis/utils/post';

const postLogout = () =>
  post<PostLogout>({
    schema: PostLogoutSchema,
    url: '/api/auth/logout',
  });

export const usePostLogout = () => {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: postLogout,
  });
};
