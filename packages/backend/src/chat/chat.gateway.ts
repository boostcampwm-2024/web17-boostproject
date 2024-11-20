import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MemoryStore } from 'express-session';
import { Server, Socket } from 'socket.io';
import { Logger } from 'winston';
import {
  SessionSocket,
  WebSocketSessionGuard,
} from '@/auth/session/webSocketSession.guard';
import { WebsocketSessionService } from '@/auth/session/websocketSession.service';
import { MEMORY_STORE } from '@/auth/session.module';
import { ChatService } from '@/chat/chat.service';
import { Chat } from '@/chat/domain/chat.entity';
import { ChatScrollQuery, isChatScrollQuery } from '@/chat/dto/chat.request';
import { LikeResponse } from '@/chat/dto/like.response';
import { WebSocketExceptionFilter } from '@/middlewares/filter/webSocketException.filter';
import { StockService } from '@/stock/stock.service';

interface chatMessage {
  room: string;
  content: string;
}

interface chatResponse {
  likeCount: number;
  message: string;
  type: string;
  createdAt: Date;
}

@WebSocketGateway({ namespace: 'chat' })
@UseFilters(WebSocketExceptionFilter)
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  websocketSessionService: WebsocketSessionService;

  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly stockService: StockService,
    private readonly chatService: ChatService,
    @Inject(MEMORY_STORE) sessionStore: MemoryStore,
  ) {
    this.websocketSessionService = new WebsocketSessionService(sessionStore);
  }

  @UseGuards(WebSocketSessionGuard)
  @SubscribeMessage('chat')
  async handleConnectStock(
    @MessageBody() message: chatMessage,
    @ConnectedSocket() client: SessionSocket,
  ) {
    const { room, content } = message;
    if (!client.rooms.has(room)) {
      client.emit('error', 'You are not in the room');
      this.logger.warn(`client is not in the room ${room}`);
      return;
    }
    if (!client.session || !client.session.id) {
      client.emit('error', 'Invalid session');
      this.logger.warn('client session is invalid');
      return;
    }
    const savedChat = await this.chatService.saveChat(client.session.id, {
      stockId: room,
      message: content,
    });
    this.server.to(room).emit('chat', this.toResponse(savedChat));
  }

  async broadcastLike(response: LikeResponse) {
    this.server.to(response.stockId).emit('like', response);
  }

  async handleConnection(client: Socket) {
    try {
      const user =
        await this.websocketSessionService.getAuthenticatedUser(client);
      const { stockId, pageSize } = await this.getChatScrollQuery(client);
      await this.validateExistStock(stockId);
      client.join(stockId);
      const messages = await this.chatService.scrollChat(
        {
          stockId,
          pageSize,
        },
        user?.id,
      );
      this.logger.info(`client joined room ${stockId}`);
      client.emit('chat', messages);
    } catch (e) {
      const error = e as Error;
      this.logger.warn(error.message);
      client.emit('error', error.message);
      client.disconnect();
    }
  }

  private async validateExistStock(stockId: string): Promise<void> {
    if (!(await this.stockService.checkStockExist(stockId))) {
      throw new Error(`Stock does not exist: ${stockId}`);
    }
  }

  private async getChatScrollQuery(client: Socket): Promise<ChatScrollQuery> {
    const query = client.handshake.query;
    if (!isChatScrollQuery(query)) {
      throw new Error('Invalid chat scroll query');
    }
    return {
      stockId: query.stockId,
      latestChatId: query.latestChatId ? Number(query.latestChatId) : undefined,
      pageSize: query.pageSize ? Number(query.pageSize) : undefined,
    };
  }

  private toResponse(chat: Chat): chatResponse {
    return {
      likeCount: chat.likeCount,
      message: chat.message,
      type: chat.type,
      createdAt: chat.date?.createdAt || new Date(),
    };
  }
}
