import { Inject, UseFilters } from '@nestjs/common';
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
import { WebSocketExceptionFilter } from '@/middlewares/filter/webSocketException.filter';

interface chatMessage {
  room: string;
  content: string;
}

@WebSocketGateway({ namespace: 'chat' })
@UseFilters(WebSocketExceptionFilter)
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(@Inject('winston') private readonly logger: Logger) {}

  @SubscribeMessage('chat')
  async handleConnectStock(
    @MessageBody() message: chatMessage,
    @ConnectedSocket() client: Socket,
  ) {
    const { room, content } = message;
    if (!client.rooms.has(room)) {
      client.emit('error', 'You are not in the room');
      this.logger.warn(`client is not in the room ${room}`);
      return;
    }
    this.server.to(room).emit('chat', content);
  }

  async handleConnection(client: Socket) {
    const room = client.handshake.query.stockId;
    if (room) {
      client.join(room);
      this.logger.info(`client joined room ${room}`);
    }
  }
}
