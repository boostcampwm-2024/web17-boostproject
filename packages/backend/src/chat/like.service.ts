import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource, EntityManager } from 'typeorm';
import { Chat } from '@/chat/domain/chat.entity';
import { Like } from '@/chat/domain/like.entity';
import { LikeResponse } from '@/chat/dto/like.response';

@Injectable()
export class LikeService {
  private readonly likedChats = new Set<number>();

  constructor(private readonly dataSource: DataSource) {}

  async toggleLike(userId: number, chatId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const chat = await this.findChat(chatId, manager);
      const like = await manager.findOne(Like, {
        where: { user: { id: userId }, chat: { id: chatId } },
      });
      this.likedChats.add(chatId);
      if (like) {
        return await this.deleteLike(manager, chat, like);
      }
      return await this.saveLike(manager, chat, userId);
    });
  }

  @Cron('*/30 * * * *')
  async calculateLike() {
    const tasks = [];
    for (const chatId of this.likedChats) {
      tasks.push(async () => {
        const likeCount = await this.dataSource
          .getRepository(Like)
          .createQueryBuilder('like')
          .where('like.chat_id = :chatId', { chatId })
          .getCount();

        await this.dataSource.getRepository(Chat).update(chatId, { likeCount });
      });
    }
    await Promise.all(tasks.map((task) => task()));
    this.likedChats.clear();
  }

  private async findChat(chatId: number, manager: EntityManager) {
    const chat = await manager.findOne(Chat, {
      where: { id: chatId },
      relations: ['stock'],
    });
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
    return LikeResponse.createLikeResponse(chat);
  }

  private async deleteLike(
    manager: EntityManager,
    chat: Chat,
    like: Like,
  ): Promise<LikeResponse> {
    chat.likeCount -= 1;
    await Promise.all([manager.remove(like), manager.save(Chat, chat)]);
    return LikeResponse.createUnlikeResponse(chat);
  }
}
