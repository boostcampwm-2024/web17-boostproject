import { ApiProperty } from '@nestjs/swagger';
import { Chat } from '@/chat/domain/chat.entity';
import { ChatType } from '@/chat/domain/chatType.enum';

interface ChatResponse {
  id: number;
  likeCount: number;
  message: string;
  type: string;
  liked: boolean;
  nickname: string;
  mentioned: boolean;
  createdAt: Date;
}

export class ChatScrollResponse {
  @ApiProperty({
    description: '다음 페이지가 있는지 여부',
    example: true,
  })
  readonly hasMore: boolean;

  @ApiProperty({
    description: '채팅 목록',
    example: [
      {
        id: 1,
        likeCount: 0,
        message: '안녕하세요',
        nickname: '초보 주주',
        type: ChatType.NORMAL,
        isLiked: true,
        createdAt: new Date(),
      },
    ],
  })
  readonly chats: ChatResponse[];

  constructor(chats: Chat[], hasMore: boolean) {
    this.chats = chats.map((chat) => ({
      id: chat.id,
      likeCount: chat.likeCount,
      message: chat.message,
      type: chat.type,
      createdAt: chat.date!.createdAt,
      liked: !!(chat.likes && chat.likes.length > 0),
      mentioned: chat.mentions && chat.mentions.length > 0,
      nickname: chat.user.nickname,
    }));
    this.hasMore = hasMore;
  }
}
