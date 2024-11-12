import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  path: '/stock',
})
export class StockGateway {
  @WebSocketServer()
  server: Server;

  constructor() {}

  @SubscribeMessage('connectStock')
  handleConnectStock(
    @MessageBody() stockId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(stockId);

    client.emit('connectionSuccess', {
      message: `Successfully connected to stock room: ${stockId}`,
      stockId,
    });
  }

  handleDisconnectStock(
    @MessageBody() stockId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(stockId);

    client.emit('disconnectionSuccess', {
      message: `Successfully disconnected to stock room: ${stockId}`,
      stockId,
    });
  }

  onUpdateStock(
    stockId: string,
    price: number,
    change: number,
    volume: number,
  ) {
    this.server.to(stockId).emit('updateStock', { price, change, volume });
  }
}
