import { Inject, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import * as webPush from 'web-push';
import { Logger } from 'winston';
import { PushSubscription } from './domain/subscription.entity';
import { SubscriptionData } from './dto/subscribe.request';
import { SubscribeResponse } from './dto/subscribe.response';

@ApiTags('Push Notifications')
@Injectable()
export class PushService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly dataSource: DataSource,
  ) {
    webPush.setVapidDetails(
      'mailto:noreply@juchum.info',
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
        `Fail to send message user id [${subscription.user.id}] : ${pushPayload}`,
        error,
      );
    }
  }

  async createSubscription(
    userId: number,
    subscriptionData: SubscriptionData,
  ): Promise<SubscribeResponse> {
    const newSubscription = this.dataSource.manager.create(PushSubscription, {
      user: { id: userId },
      endpoint: subscriptionData.endpoint,
      p256dh: subscriptionData.keys.p256dh,
      auth: subscriptionData.keys.auth,
    });

    await this.dataSource.manager.save(newSubscription);
    const result: SubscribeResponse = {
      userId,
      message: 'Push subscription success',
    };
    return result;
  }
}
