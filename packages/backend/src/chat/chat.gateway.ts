import { Inject } from '@nestjs/common';
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

interface chatMessage {
  room: string;
  content: string;
}

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(@Inject('winston') private readonly logger: Logger) {}

  @SubscribeMessage('chat')
  handleConnectStock(
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

  handleConnection(client: Socket) {
    const room = client.handshake.query.stockId;
    if (room) {
      client.join(room);
      this.logger.info(`client joined room ${room}`);
    }
  }
}
