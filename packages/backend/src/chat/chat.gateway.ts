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
import { WebSocketExceptionFilter } from '@/middlewares/filter/webSocketException.filter';
import { StockService } from '@/stock/stock.service';

interface chatMessage {
  room: string;
  content: string;
}

@WebSocketGateway({ namespace: 'chat' })
@UseFilters(WebSocketExceptionFilter)
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly stockService: StockService,
  ) {}

  @UseGuards(WebSocketSessionGuard)
  @SubscribeMessage('chat')
  async handleConnectStock(
    @MessageBody() message: chatMessage,
    @ConnectedSocket() client: SessionSocket,
  ) {
    const { room, content } = message;
    this.logger.info(`message from ${client.session?.nickname}`);
    if (!client.rooms.has(room)) {
      client.emit('error', 'You are not in the room');
      this.logger.warn(`client is not in the room ${room}`);
      return;
    }
    this.server.to(room).emit('chat', content);
  }

  async handleConnection(client: Socket) {
    const room = client.handshake.query.stockId;
    if (!room || !(await this.stockService.checkStockExist(room as string))) {
      client.emit('error', 'Invalid stockId');
      this.logger.warn(`client connected with invalid stockId: ${room}`);
      client.disconnect();
      return;
    }
    if (room) {
      client.join(room);
      this.logger.info(`client joined room ${room}`);
    }
  }
}
