import { ApiProperty } from '@nestjs/swagger';

export class SubscribeResponse {
  @ApiProperty({ example: 'success', description: '성공 메시지' })
  message: string;
}
