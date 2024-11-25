import { User } from '@/user/domain/user.entity';

export class SubscriptionData {
  user: User;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
