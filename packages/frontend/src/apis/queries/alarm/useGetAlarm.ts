import { useQuery } from '@tanstack/react-query';
import { type AlarmResponse, AlarmResponseSchema } from './schema';
import { get } from '@/apis/utils/get';

const getAlarm = () =>
  get<AlarmResponse>({
    schema: AlarmResponseSchema,
    url: '/api/alarm/user',
  });

export const useGetAlarm = ({ loginStatus }: { loginStatus: boolean }) => {
  return useQuery({
    queryKey: ['getAlarm'],
    queryFn: getAlarm,
    enabled: loginStatus,
  });
};
