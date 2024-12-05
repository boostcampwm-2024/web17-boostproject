import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  type PostCreateAlarmRequest,
  type AlarmResponse,
  AlarmInfoSchema,
} from './schema';
import { post } from '@/apis/utils/post';

const postCreateAlarm = ({
  stockId,
  targetPrice,
  targetVolume,
  alarmExpiredDate,
}: PostCreateAlarmRequest) =>
  post<AlarmResponse>({
    params: { stockId, targetPrice, targetVolume, alarmExpiredDate },
    schema: AlarmInfoSchema,
    url: '/api/alarm',
  });

export const usePostCreateAlarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['createAlarm'],
    mutationFn: ({
      stockId,
      targetPrice,
      targetVolume,
      alarmExpiredDate,
    }: PostCreateAlarmRequest) =>
      postCreateAlarm({ stockId, targetPrice, targetVolume, alarmExpiredDate }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['getStockAlarm', 'getAlarm'],
      }),
  });
};
