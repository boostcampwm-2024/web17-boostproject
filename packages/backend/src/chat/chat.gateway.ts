import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
import {
  ChatMessage,
  ChatScrollQuery,
  isChatScrollQuery,
} from '@/chat/dto/chat.request';
import { ChatResponse } from '@/chat/dto/chat.response';
import { LikeResponse } from '@/chat/dto/like.response';
import { MentionService } from '@/chat/mention.service';
import { WebSocketExceptionFilter } from '@/middlewares/filter/webSocketException.filter';
import { StockService } from '@/stock/stock.service';
import { User } from '@/user/domain/user.entity';
import { UserService } from '@/user/user.service';

@WebSocketGateway({ namespace: '/api/chat/realtime' })
@UseFilters(WebSocketExceptionFilter)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private websocketSessionService: WebsocketSessionService;
  private users = new Map<number, string>();

  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly stockService: StockService,
    private readonly chatService: ChatService,
    private readonly mentionService: MentionService,
    private readonly UserService: UserService,
    @Inject(MEMORY_STORE) sessionStore: MemoryStore,
  ) {
    this.websocketSessionService = new WebsocketSessionService(sessionStore);
  }

  @UseGuards(WebSocketSessionGuard)
  @SubscribeMessage('chat')
  async handleConnectChat(
    @MessageBody() message: ChatMessage,
    @ConnectedSocket() client: SessionSocket,
  ) {
    const { room, content, nickname, subName } = message;
    if (!this.isClientInRoom(client, room)) return;
    if (!this.isValidSession(client)) return;
    const savedChat = await this.saveChat(client.session.id, room, content);
    if (nickname && subName) {
      return await this.mentionUser(
        nickname,
        subName,
        savedChat,
        client.session,
        room,
      );
    }
    this.broadcastChat(savedChat, room, client.session);
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
      const messages = await this.scrollChat(stockId, user, pageSize);
      this.logger.info(`client joined room ${stockId}`);
      client.emit('chat', messages);
      if (user) {
        this.users.set(user.id, client.id);
      }
    } catch (e) {
      const error = e as Error;
      this.logger.warn(error.message);
      client.emit('error', error.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const user =
      await this.websocketSessionService.getAuthenticatedUser(client);
    if (user) {
      this.users.delete(user.id);
    }
  }

  private isValidSession(
    client: SessionSocket,
  ): client is SessionSocket & { session: User } {
    if (!client.session || !client.session.id) {
      client.emit('error', 'Invalid session');
      this.logger.warn('client session is invalid');
      return false;
    }
    return true;
  }

  private isClientInRoom(client: SessionSocket, room: string): boolean {
    if (!client.rooms.has(room)) {
      client.emit('error', 'You are not in the room');
      this.logger.warn(`client is not in the room ${room}`);
      return false;
    }
    return true;
  }

  private async saveChat(userId: number, room: string, content: string) {
    return await this.chatService.saveChat(userId, {
      stockId: room,
      message: content,
    });
  }

  private async broadcastMentionChat(
    chat: Chat,
    room: string,
    mentionedSocket: string,
    client: User,
  ) {
    const chatResponse = this.toResponse(chat, client);
    this.server.to(room).except(mentionedSocket).emit('chat', chatResponse);
    chatResponse.mentioned = true;
    this.server.to(mentionedSocket).emit('chat', chatResponse);
  }

  private async mentionUser(
    nickname: string,
    subName: string,
    savedChat: Chat,
    client: User,
    room: string,
  ) {
    const mentionedUser = await this.searchMentionedUser(nickname, subName);
    if (!mentionedUser) {
      return this.broadcastChat(savedChat, room, client);
    }
    await this.mentionService.createMention(savedChat.id, mentionedUser.id);
    const mentionedSocket = this.users.get(Number(mentionedUser.id));
    if (mentionedSocket) {
      return await this.broadcastMentionChat(
        savedChat,
        room,
        mentionedSocket,
        client,
      );
    }
  }

  private async searchMentionedUser(nickname: string, subName: string) {
    return await this.UserService.searchOneUserByNicknameAndSubName(
      nickname,
      subName,
    );
  }

  private broadcastChat(chat: Chat, room: string, client: User) {
    const chatResponse = this.toResponse(chat, client);
    this.server.to(room).emit('chat', chatResponse);
    return;
  }

  private async scrollChat(
    stockId: string,
    user: User | null,
    pageSize?: number,
  ) {
    return await this.chatService.scrollChat(
      {
        stockId,
        pageSize,
      },
      user?.id,
    );
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

  private toResponse(chat: Chat, user: User): ChatResponse {
    return {
      id: chat.id,
      likeCount: chat.likeCount,
      message: chat.message,
      type: chat.type,
      mentioned: false,
      nickname: user.nickname,
      subName: user.subName,
      liked: false,
      createdAt: chat.date?.createdAt || new Date(),
    };
  }
}
