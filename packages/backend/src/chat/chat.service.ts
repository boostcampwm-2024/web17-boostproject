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

  async scrollFirstChat(chatScrollQuery: ChatScrollQuery, userId?: number) {
    const { pageSize } = chatScrollQuery;
    this.validatePageSize(pageSize);
    const result = await this.findFirstChatScroll(chatScrollQuery, userId);
    return await this.toScrollResponse(result, pageSize);
  }

  async scrollNextChat(chatScrollQuery: ChatScrollQuery, userId?: number) {
    const { pageSize } = chatScrollQuery;
    this.validatePageSize(pageSize);
    const result = await this.findChatScroll(chatScrollQuery, userId);
    return await this.toScrollResponse(result, pageSize);
  }

  private validatePageSize(scrollSize?: number) {
    if (scrollSize && scrollSize > 100) {
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
    if (!chatScrollQuery.latestChatId) {
      return await this.findFirstChatScroll(chatScrollQuery, userId);
    } else {
      return await this.findNextChatScroll(chatScrollQuery);
    }
  }

  private async findFirstChatScroll(
    chatScrollQuery: ChatScrollQuery,
    userId?: number,
  ) {
    const queryBuilder = this.dataSource.createQueryBuilder(Chat, 'chat');
    if (!chatScrollQuery.pageSize) {
      chatScrollQuery.pageSize = DEFAULT_PAGE_SIZE;
    }
    const { stockId, pageSize } = chatScrollQuery;
    return queryBuilder
      .leftJoinAndSelect('chat.likes', 'like', 'like.user_id = :userId', {
        userId,
      })
      .where('chat.stock_id = :stockId', { stockId })
      .orderBy('chat.id', 'DESC')
      .take(pageSize + 1)
      .getMany();
  }

  private async findNextChatScroll(
    chatScrollQuery: ChatScrollQuery,
    userId?: number,
  ) {
    const queryBuilder = this.dataSource.createQueryBuilder(Chat, 'chat');
    if (!chatScrollQuery.pageSize) {
      chatScrollQuery.pageSize = DEFAULT_PAGE_SIZE;
    }
    const { stockId, latestChatId, pageSize } = chatScrollQuery;
    return queryBuilder
      .leftJoinAndSelect('chat.likes', 'like', 'like.user_id = :userId', {
        userId,
      })
      .where('chat.stock_id = :stockId and chat.id < :latestChatId', {
        stockId,
        latestChatId,
      })
      .orderBy('chat.id', 'DESC')
      .limit(pageSize + 1)
      .getMany();
  }
}
