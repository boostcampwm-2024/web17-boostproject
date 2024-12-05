import { useQuery } from '@tanstack/react-query';
import { type AlarmResponse, AlarmResponseSchema } from './schema';
import { get } from '@/apis/utils/get';

const getAlarm = () =>
  get<AlarmResponse>({
    schema: AlarmResponseSchema,
    url: '/api/alarm/user',
  });

export const useGetAlarm = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return useQuery({
    queryKey: ['getAlarm'],
    queryFn: getAlarm,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.reverse(),
  });
};
