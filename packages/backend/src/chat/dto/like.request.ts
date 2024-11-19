import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LikeRequest {
  @ApiProperty({
    required: true,
    type: Number,
    description: '좋아요를 누를 채팅의 ID',
    example: 1,
  })
  @IsNumber()
  chatId: number;
}
