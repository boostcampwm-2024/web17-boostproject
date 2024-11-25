import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as webPush from 'web-push';
import { Logger } from 'winston';
import { PushSubscription } from './domain/subscription.entity';
import { SubscriptionData } from './dto/subscription';
import { User } from '@/user/domain/user.entity';

@Injectable()
export class PushService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly dataSource: DataSource,
  ) {
    webPush.setVapidDetails(
      'mailto:admin@juchum.info',
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );
  }

  async sendPushNotification(
    subscription: PushSubscription,
    payload: object,
  ): Promise<void> {
    const pushPayload = JSON.stringify(payload);

    try {
      await webPush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        pushPayload,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to send push notification to ${subscription.endpoint}`,
        error,
      );
    }
  }

  async createSubscription(
    userId: number,
    subscriptionData: SubscriptionData,
  ): Promise<PushSubscription> {
    return await this.dataSource.transaction(async (manager) => {
      const user = new User();
      user.id = userId;

      const newSubscription = manager.create(PushSubscription, {
        user: user,
        endpoint: subscriptionData.endpoint,
        p256dh: subscriptionData.keys.p256dh,
        auth: subscriptionData.keys.auth,
      });

      return await manager.save(newSubscription);
    });
  }
}
