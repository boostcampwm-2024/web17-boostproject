import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class StockGateway {
  @WebSocketServer()
  server: Server;

  constructor() {}

  @SubscribeMessage('connectStock')
  handleJoinStockRoom(
    @MessageBody() stockId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(stockId);
  }

  onUpdateStock(stockId: string, price: number, change: number) {
    this.server.to(stockId).emit('updateStock', price, change);
  }
}
