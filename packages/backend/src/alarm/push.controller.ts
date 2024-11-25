import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SubscriptionData } from './dto/subscription';
import { PushService } from './push.service';
import SessionGuard from '@/auth/session/session.guard';
import { GetUser } from '@/common/decorator/user.decorator';
import { User } from '@/user/domain/user.entity';

@Controller('/push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('subscribe')
  @UseGuards(SessionGuard)
  async subscribe(
    @Body() subscriptionData: SubscriptionData,
    @GetUser() user: User,
  ) {
    const userId = user.id;

    const newSubscription = await this.pushService.createSubscription(
      userId,
      subscriptionData,
    );

    return {
      message: 'Subscription saved.',
      subscriptionId: newSubscription.id,
    };
  }
}
