import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Chat } from '@/chat/domain/chat.entity';
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

  async scrollFirstChat(stockId: string, scrollSize?: number) {
    this.validatePageSize(scrollSize);
    const result = await this.findFirstChatScroll(stockId, scrollSize);
    return await this.toScrollResponse(result, scrollSize);
  }

  async scrollNextChat(
    stockId: string,
    latestChatId?: number,
    pageSize?: number,
  ) {
    this.validatePageSize(pageSize);
    const result = await this.findChatScroll(stockId, latestChatId, pageSize);
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
    stockId: string,
    latestChatId?: number,
    pageSize?: number,
  ) {
    if (!latestChatId) {
      return await this.findFirstChatScroll(stockId, pageSize);
    } else {
      return await this.findNextChatScroll(stockId, latestChatId, pageSize);
    }
  }

  private async findFirstChatScroll(stockId: string, pageSize?: number) {
    const queryBuilder = this.dataSource.createQueryBuilder(Chat, 'chat');
    if (!pageSize) {
      pageSize = DEFAULT_PAGE_SIZE;
    }
    return queryBuilder
      .where('chat.stock_id = :stockId', { stockId })
      .orderBy('chat.id', 'DESC')
      .limit(pageSize + 1)
      .getMany();
  }

  private async findNextChatScroll(
    stockId: string,
    latestChatId: number,
    pageSize?: number,
  ) {
    const queryBuilder = this.dataSource.createQueryBuilder(Chat, 'chat');
    if (!pageSize) {
      pageSize = DEFAULT_PAGE_SIZE;
    }
    return queryBuilder
      .where('chat.stock_id = :stockId and chat.id < :latestChatId', {
        stockId,
        latestChatId,
      })
      .orderBy('chat.id', 'DESC')
      .limit(pageSize + 1)
      .getMany();
  }
}
