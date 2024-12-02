import { useQuery } from '@tanstack/react-query';
import { UserThemeSchema, type GetUserTheme } from './schema';
import { get } from '@/apis/utils/get';

const getUserTheme = () =>
  get<GetUserTheme>({
    schema: UserThemeSchema,
    url: '/api/user/theme',
  });

export const useGetUserTheme = () => {
  return useQuery({
    queryKey: ['userTheme'],
    queryFn: getUserTheme,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.theme,
  });
};
