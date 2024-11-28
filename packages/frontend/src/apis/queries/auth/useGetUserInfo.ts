import { useQuery } from '@tanstack/react-query';
import { GetUserInfoSchema, type GetUserInfo } from './schema';
import { get } from '@/apis/utils/get';

const getUserInfo = () =>
  get<GetUserInfo>({
    schema: GetUserInfoSchema,
    url: '/api/user/info',
  });

export const useGetUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  });
};
