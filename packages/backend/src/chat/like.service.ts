import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Chat } from '@/chat/domain/chat.entity';
import { Like } from '@/chat/domain/like.entity';
import { LikeResponse } from '@/chat/dto/like.response';

@Injectable()
export class LikeService {
  constructor(private readonly dataSource: DataSource) {}

  async toggleLike(userId: number, chatId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const chat = await this.findChat(chatId, manager);
      return await this.saveLike(manager, chat, userId);
    });
  }

  private async findChat(chatId: number, manager: EntityManager) {
    const chat = await manager.findOne(Chat, { where: { id: chatId } });
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    return chat;
  }

  private async saveLike(
    manager: EntityManager,
    chat: Chat,
    userId: number,
  ): Promise<LikeResponse> {
    chat.likeCount += 1;
    await Promise.all([
      manager.save(Like, {
        user: { id: userId },
        chat,
      }),
      manager.save(Chat, chat),
    ]);
    return {
      likeCount: chat.likeCount,
      message: 'like chat',
      chatId: chat.id,
      date: chat.date.updatedAt,
    };
  }
}
