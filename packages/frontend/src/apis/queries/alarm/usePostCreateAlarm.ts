import { useMutation } from '@tanstack/react-query';
import {
  type PostCreateAlarmRequest,
  type AlarmInfoResponse,
  AlarmInfoSchema,
} from './schema';
import { post } from '@/apis/utils/post';

const postCreateAlarm = ({
  stockId,
  targetPrice,
  targetVolum,
  alarmDate,
}: PostCreateAlarmRequest) =>
  post<AlarmInfoResponse>({
    params: { stockId, targetPrice, targetVolum, alarmDate },
    schema: AlarmInfoSchema,
    url: '/api/alarm',
  });

export const usePostCreateAlarm = ({
  stockId,
  targetPrice,
  targetVolum,
  alarmDate,
}: PostCreateAlarmRequest) => {
  return useMutation({
    mutationKey: ['createAlarm', stockId, targetPrice, targetVolum, alarmDate],
    mutationFn: () =>
      postCreateAlarm({ stockId, targetPrice, targetVolum, alarmDate }),
  });
};
