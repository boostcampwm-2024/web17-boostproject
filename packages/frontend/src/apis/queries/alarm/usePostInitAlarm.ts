import { useMutation } from '@tanstack/react-query';
import {
  type PostInitAlarmResponse,
  PostInitAlarmResponseSchema,
} from './schema';
import { post } from '@/apis/utils/post';

const postInitAlarm = (subscription: PushSubscription) =>
  post<PostInitAlarmResponse>({
    params: subscription,
    schema: PostInitAlarmResponseSchema,
    url: '/api/push/subscribe',
  });

export const usePostInitAlarm = () => {
  return useMutation({
    mutationKey: ['initAlarm'],
    mutationFn: (subscription: PushSubscription) => postInitAlarm(subscription),
  });
};
