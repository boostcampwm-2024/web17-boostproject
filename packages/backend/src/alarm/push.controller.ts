import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionData } from './dto/subscribe.request';
import { SubscribeResponse } from './dto/subscribe.response';
import { PushService } from './push.service';
import SessionGuard from '@/auth/session/session.guard';
import { GetUser } from '@/common/decorator/user.decorator';
import { User } from '@/user/domain/user.entity';

@Controller('/push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('subscribe')
  @ApiOperation({
    summary: '알림 서비스 초기 설정',
    description: '유저가 로그인할 때 알림을 받을 수 있게 초기설정한다.',
  })
  @ApiResponse({
    status: 201,
    description: '알림 초기설정',
    type: SubscribeResponse,
  })
  @UseGuards(SessionGuard)
  async subscribe(
    @Body() subscriptionData: SubscriptionData,
    @GetUser() user: User,
  ) {
    const userId = user.id;

    return await this.pushService.createSubscription(userId, subscriptionData);
  }
}
