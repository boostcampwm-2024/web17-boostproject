import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { DataSource, EntityManager, SelectQueryBuilder } from 'typeorm';
import { Chat } from '@/chat/domain/chat.entity';
import { ChatScrollQuery } from '@/chat/dto/chat.request';
import { ChatScrollResponse } from '@/chat/dto/chat.response';
import { UserStock } from '@/stock/domain/userStock.entity';

export interface ChatMessage {
  message: string;
  stockId: string;
}

const ORDER = {
  LIKE: 'like',
  LATEST: 'latest',
} as const;

export type Order = (typeof ORDER)[keyof typeof ORDER];

const DEFAULT_PAGE_SIZE = 20;

@Injectable()
export class ChatService {
  constructor(private readonly dataSource: DataSource) {}

  async saveChat(userId: number, chatMessage: ChatMessage) {
    return this.dataSource.transaction(async (manager) => {
      if (!(await this.hasStock(userId, chatMessage.stockId, manager))) {
        throw new WsException('not have stock');
      }
      return manager.save(Chat, {
        user: { id: userId },
        stock: { id: chatMessage.stockId },
        message: chatMessage.message,
      });
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
    const queryBuilder = await this.buildChatScrollQuery(
      chatScrollQuery,
      userId,
      ORDER.LIKE,
    );
    return queryBuilder.getMany();
  }

  private hasStock(userId: number, stockId: string, manager: EntityManager) {
    return manager.exists(UserStock, {
      where: { user: { id: userId }, stock: { id: stockId } },
    });
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
    const queryBuilder = await this.buildChatScrollQuery(
      chatScrollQuery,
      userId,
    );
    return queryBuilder.getMany();
  }

  private async buildChatScrollQuery(
    chatScrollQuery: ChatScrollQuery,
    userId?: number,
    order: Order = ORDER.LATEST,
  ) {
    const queryBuilder = this.dataSource.createQueryBuilder(Chat, 'chat');
    const { stockId, latestChatId, pageSize } = chatScrollQuery;
    const size = pageSize ? pageSize : DEFAULT_PAGE_SIZE;

    queryBuilder
      .leftJoinAndSelect('chat.likes', 'like', 'like.user_id = :userId', {
        userId,
      })
      .leftJoinAndSelect('chat.user', 'user')
      .where('chat.stock_id = :stockId', { stockId })
      .take(size + 1);

    if (order === ORDER.LIKE) {
      return this.buildLikeCountQuery(queryBuilder, latestChatId);
    }
    queryBuilder.orderBy('chat.id', 'DESC');
    if (latestChatId) {
      queryBuilder.andWhere('chat.id < :latestChatId', { latestChatId });
    }

    return queryBuilder;
  }

  private async buildLikeCountQuery(
    queryBuilder: SelectQueryBuilder<Chat>,
    latestChatId?: number,
  ) {
    queryBuilder
      .orderBy('chat.likeCount', 'DESC')
      .addOrderBy('chat.id', 'DESC');
    if (latestChatId) {
      const chat = await this.dataSource.manager.findOne(Chat, {
        where: { id: latestChatId },
        select: ['likeCount'],
      });
      if (chat) {
        queryBuilder.andWhere(
          'chat.likeCount < :likeCount or' +
            ' (chat.likeCount = :likeCount and chat.id < :latestChatId)',
          {
            likeCount: chat.likeCount,
            latestChatId,
          },
        );
      }
    }
    return queryBuilder;
  }
}
