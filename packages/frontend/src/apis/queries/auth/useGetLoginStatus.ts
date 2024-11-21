import { useQuery } from '@tanstack/react-query';
import { GetLoginStatusResponse } from './types';
import { instance } from '@/apis/config';

const getLoginStatus = async (): Promise<GetLoginStatusResponse> => {
  const { data } = await instance.get('/api/auth/google/status');
  return data;
};

export const useGetLoginStatus = () => {
  return useQuery<GetLoginStatusResponse, Error>({
    queryKey: ['login_status'],
    queryFn: getLoginStatus,
  });
};
