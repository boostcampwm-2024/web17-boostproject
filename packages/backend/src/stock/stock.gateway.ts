import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Mutex } from 'async-mutex';
import { Server, Socket } from 'socket.io';
import { LiveData } from '@/scraper/openapi/liveData.service';

@WebSocketGateway({
  namespace: '/api/stock/realtime',
})
@Injectable()
export class StockGateway {
  @WebSocketServer()
  server: Server;
  private readonly mutex = new Mutex();

  constructor(private readonly liveData: LiveData) {}

  @SubscribeMessage('connectStock')
  async handleConnectStock(
    @MessageBody() stockId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(stockId);

    await this.mutex.runExclusive(async () => {
      const connectedSockets = await this.server.in(stockId).fetchSockets();

      if (connectedSockets.length > 0 && !this.liveData.isSubscribe(stockId)) {
        this.liveData.subscribe(stockId);
      }
    });

    client.emit('connectionSuccess', {
      message: `Successfully connected to stock room: ${stockId}`,
      stockId,
    });
  }

  async handleDisconnectStock(
    @MessageBody() stockId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(stockId);

    await this.mutex.runExclusive(async () => {
      const connectedSockets = await this.server.in(stockId).fetchSockets();

      if (connectedSockets.length === 0) {
        this.liveData.unsubscribe(stockId);
      }
    });

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
