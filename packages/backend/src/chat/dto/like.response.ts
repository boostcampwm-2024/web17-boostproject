import { ApiProperty } from '@nestjs/swagger';
import { Chat } from '@/chat/domain/chat.entity';

export class LikeResponse {
  @ApiProperty({
    type: Number,
    description: '좋아요를 누른 채팅의 ID',
    example: 1,
  })
  chatId: number;

  @ApiProperty({
    type: 'string',
    description: '참여 중인 좀목 id',
    example: 'A005930',
  })
  stockId: string;

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

  static createLikeResponse(chat: Chat): LikeResponse {
    if (!isStockId(chat.stock.id)) {
      throw new Error(`Stock id is undefined: ${chat.id}`);
    }
    return {
      stockId: chat.stock.id,
      chatId: chat.id,
      likeCount: chat.likeCount,
      message: 'like chat',
      date: chat.date.updatedAt,
    };
  }

  static createUnlikeResponse(chat: Chat): LikeResponse {
    if (!isStockId(chat.stock.id)) {
      throw new Error(`Stock id is undefined: ${chat.id}`);
    }
    return {
      stockId: chat.stock.id,
      chatId: chat.id,
      likeCount: chat.likeCount,
      message: 'like cancel',
      date: chat.date.updatedAt,
    };
  }
}

function isStockId(stockId?: string): stockId is string {
  return stockId !== undefined;
}