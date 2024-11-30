import { ApiProperty } from '@nestjs/swagger';
//import { User } from '@/user/domain/user.entity';

export class SubscriptionData {
  //@ApiProperty({ type: () => User, description: '유저 아이디' })
  //user: User;

  @ApiProperty({
    type: 'string',
    description: '엔드 포인트 설정',
  })
  endpoint: string;

  @ApiProperty({
    type: 'object',
    description: 'VAPID 키',
    properties: {
      p256dh: { type: 'string' },
      auth: { type: 'string' },
    },
  })
  keys: {
    p256dh: string;
    auth: string;
  };
}
