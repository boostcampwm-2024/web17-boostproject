import { ApiProperty } from '@nestjs/swagger';

export class LikeResponse {
  @ApiProperty({
    type: Number,
    description: '좋아요를 누른 채팅의 ID',
    example: 1,
  })
  chatId: number;

  @ApiProperty({
    type: Number,
    description: '채팅의 좋아요 수',
    example: 45,
  })
  likeCount: number;

  @ApiProperty({
    type: String,
    description: '결과 메시지',
    example: 'like chat',
  })
  message: string;

  @ApiProperty({
    type: Date,
    description: '좋아요를 누른 시간',
    example: '2021-08-01T00:00:00',
  })
  date: Date;
}
