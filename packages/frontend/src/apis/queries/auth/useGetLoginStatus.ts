import { useQuery } from '@tanstack/react-query';
import { GetLoginStatusSchema, type GetLoginStatus } from './schema';
import { get } from '@/apis/utils/get';

const getLoginStatus = () =>
  get<GetLoginStatus>({
    schema: GetLoginStatusSchema,
    url: '/api/auth/status',
  });

export const useGetLoginStatus = () => {
  return useQuery({
    queryKey: ['loginStatus'],
    queryFn: getLoginStatus,
    staleTime: 1000 * 60 * 5,
  });
};
