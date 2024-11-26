import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Chat } from '@/chat/domain/chat.entity';
import { Mention } from '@/chat/domain/mention.entity';
import { User } from '@/user/domain/user.entity';

@Injectable()
export class MentionService {
  constructor(private readonly dataSource: DataSource) {}

  async createMention(chatId: number, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      if (!(await this.existsChatAndUser(chatId, userId, manager))) {
        return null;
      }
      return await manager.save(Mention, {
        chat: { id: chatId },
        user: { id: userId },
      });
    });
  }

  async existsChatAndUser(
    chatId: number,
    userId: number,
    manager: EntityManager,
  ) {
    if (!(await manager.exists(User, { where: { id: userId } }))) {
      return false;
    }
    return await manager.exists(Chat, {
      where: { id: chatId },
    });
  }
}
