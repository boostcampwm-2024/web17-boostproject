import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Chat } from '@/chat/domain/chat.entity';
import { ChatScrollQuery } from '@/chat/dto/chat.request';
import { ChatScrollResponse } from '@/chat/dto/chat.response';

export interface ChatMessage {
  message: string;
  stockId: string;
}

const DEFAULT_PAGE_SIZE = 20;

@Injectable()
export class ChatService {
  constructor(private readonly dataSource: DataSource) {}

  async saveChat(userId: number, chatMessage: ChatMessage) {
    return this.dataSource.manager.save(Chat, {
      user: { id: userId },
      stock: { id: chatMessage.stockId },
      message: chatMessage.message,
    });
  }

  async scrollChat(chatScrollQuery: ChatScrollQuery, userId?: number) {
    this.validatePageSize(chatScrollQuery);
    const result = await this.findChatScroll(chatScrollQuery, userId);
    return await this.toScrollResponse(result, chatScrollQuery.pageSize);
  }

  async scrollChatByLike(chatScrollQuery: ChatScrollQuery, userId?: number) {
    this.validatePageSize(chatScrollQuery);
    const result = await this.findChatScrollOrderByLike(
      chatScrollQuery,
      userId,
    );
    return await this.toScrollResponse(result, chatScrollQuery.pageSize);
  }

  async findChatScrollOrderByLike(
    chatScrollQuery: ChatScrollQuery,
    userId?: number,
  ) {
    const queryBuilder = await this.buildChatScrollByLikeQuery(
      chatScrollQuery,
      userId,
    );
    return queryBuilder.getMany();
  }

  private validatePageSize(chatScrollQuery: ChatScrollQuery) {
    const { pageSize } = chatScrollQuery;
    if (pageSize && pageSize > 100) {
      throw new BadRequestException('pageSize should be less than 100');
    }
  }

  private async toScrollResponse(result: Chat[], pageSize: number | undefined) {
    const hasMore =
      !!result && result.length > (pageSize ? pageSize : DEFAULT_PAGE_SIZE);
    if (hasMore) {
      result.pop();
    }
    return new ChatScrollResponse(result, hasMore);
  }

  private async findChatScroll(
    chatScrollQuery: ChatScrollQuery,
    userId?: number,
  ) {
    const queryBuilder = this.buildChatScrollQuery(chatScrollQuery, userId);
    return queryBuilder.getMany();
  }

  private async buildChatScrollByLikeQuery(
    chatScrollQuery: ChatScrollQuery,
    userId?: number,
  ) {
    const queryBuilder = this.dataSource.createQueryBuilder(Chat, 'chat');
    const { stockId, latestChatId, pageSize } = chatScrollQuery;
    const size = pageSize ? pageSize : DEFAULT_PAGE_SIZE;

    queryBuilder
      .leftJoinAndSelect('chat.likes', 'like', 'like.user_id = :userId', {
        userId,
      })
      .where('chat.stock_id = :stockId', { stockId })
      .orderBy('chat.likeCount', 'DESC')
      .addOrderBy('chat.id', 'DESC')
      .take(size + 1);
    if (latestChatId) {
      const chat = await this.dataSource.manager.findOne(Chat, {
        where: { id: latestChatId },
        select: ['likeCount'],
      });
      if (chat) {
        queryBuilder.andWhere(
          'chat.likeCount < :likeCount or (chat.likeCount = :likeCount and chat.id < :latestChatId)',
          {
            likeCount: chat.likeCount,
            latestChatId,
          },
        );
      }
    }

    return queryBuilder;
  }

  private buildChatScrollQuery(
    chatScrollQuery: ChatScrollQuery,
    userId?: number,
  ) {
    const queryBuilder = this.dataSource.createQueryBuilder(Chat, 'chat');
    const { stockId, latestChatId, pageSize } = chatScrollQuery;
    const size = pageSize ? pageSize : DEFAULT_PAGE_SIZE;

    queryBuilder
      .leftJoinAndSelect('chat.likes', 'like', 'like.user_id = :userId', {
        userId,
      })
      .where('chat.stock_id = :stockId', { stockId })
      .orderBy('chat.id', 'DESC')
      .take(size + 1);
    if (latestChatId) {
      queryBuilder.andWhere('chat.id < :latestChatId', { latestChatId });
    }

    return queryBuilder;
  }
}
