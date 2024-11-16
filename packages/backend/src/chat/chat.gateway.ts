import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from 'winston';
import {
  SessionSocket,
  WebSocketSessionGuard,
} from '@/auth/session/webSocketSession.guard.';
import { ChatService } from '@/chat/chat.service';
import { Chat } from '@/chat/domain/chat.entity';
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
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly stockService: StockService,
    private readonly chatService: ChatService,
  ) {}

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

  async handleConnection(client: Socket) {
    const room = client.handshake.query.stockId;
    if (
      !this.isString(room) ||
      !(await this.stockService.checkStockExist(room))
    ) {
      client.emit('error', 'Invalid stockId');
      this.logger.warn(`client connected with invalid stockId: ${room}`);
      client.disconnect();
      return;
    }
    client.join(room);
    const messages = await this.chatService.scrollFirstChat(room);
    this.logger.info(`client joined room ${room}`);
    client.emit('chat', messages);
  }

  private isString(value: string | string[] | undefined): value is string {
    return typeof value === 'string';
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
