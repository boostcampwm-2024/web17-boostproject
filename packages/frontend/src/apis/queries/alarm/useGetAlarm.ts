import { useQuery } from '@tanstack/react-query';
import { type AlarmInfoResponse, AlarmInfoSchema } from './schema';
import { get } from '@/apis/utils/get';

const getAlarm = () =>
  get<AlarmInfoResponse>({
    schema: AlarmInfoSchema,
    url: '/api/alarm/user',
  });

export const useGetAlarm = () => {
  return useQuery({
    queryKey: ['getAlarm'],
    queryFn: getAlarm,
  });
};
