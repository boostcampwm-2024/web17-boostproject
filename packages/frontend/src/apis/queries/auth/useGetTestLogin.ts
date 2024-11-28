import { useQuery } from '@tanstack/react-query';
import { GetTestLoginSchema, type GetTestLogin } from './schema';
import { get } from '@/apis/utils/get';

const getTestLogin = ({ password, username }: GetTestLogin) =>
  get({
    schema: GetTestLoginSchema,
    url: '/api/auth/tester/login',
    params: {
      password,
      username,
    },
  });

export const useGetTestLogin = ({ password, username }: GetTestLogin) => {
  return useQuery({
    queryKey: ['testLogin', password, username],
    queryFn: () => getTestLogin({ password, username }),
    enabled: false,
  });
};
