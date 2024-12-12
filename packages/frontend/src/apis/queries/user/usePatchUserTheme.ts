import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  type PatchUserTheme,
  type PatchUserThemeRequest,
  UserThemeSchema,
} from './schema';
import { patch } from '@/apis/utils/patch';

const patchUserTheme = ({ theme }: PatchUserThemeRequest) =>
  patch<PatchUserTheme>({
    params: { theme },
    schema: UserThemeSchema,
    url: '/api/user/theme',
  });

export const usePatchUserTheme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['patchTheme'],
    mutationFn: ({ theme }: PatchUserThemeRequest) => patchUserTheme({ theme }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userTheme'] }),
  });
};
