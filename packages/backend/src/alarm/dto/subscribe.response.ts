import { ApiProperty } from '@nestjs/swagger';

export class SubscribeResponse {
  @ApiProperty({ example: 1, description: 'User ID' })
  userId: number;

  @ApiProperty({ example: 'success', description: 'Response message' })
  message: string;
}
