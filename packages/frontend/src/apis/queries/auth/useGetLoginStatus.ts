import { useQuery } from '@tanstack/react-query';
import { GetLoginStatusSchema, type GetLoginStatus } from './schema';
import { get } from '@/apis/utils/get';

const getLoginStatus = () =>
  get<GetLoginStatus>({
    schema: GetLoginStatusSchema,
    url: '/api/auth/google/status',
  });

export const useGetLoginStatus = () => {
  return useQuery({
    queryKey: ['loginStatus'],
    queryFn: getLoginStatus,
  });
};
