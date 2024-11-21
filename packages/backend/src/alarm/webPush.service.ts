import { Inject, Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import * as webPush from 'web-push';
import { Logger } from 'winston';
import { PushSubscription } from './domain/subscription.entity';

config();

@Injectable()
export class PushService {
  constructor(@Inject('winston') private readonly logger: Logger) {
    webPush.setVapidDetails(
      'mailto:admin@juchum.info',
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );
  }

  async sendPushNotification(subscription: PushSubscription, payload: object) {
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
      this.logger.info('Push notification sent successfully');
    } catch (error) {
      this.logger.warn('Failed to send push notification', error);
    }
  }
}
