import { Inject, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Mutex } from 'async-mutex';
import { Server, Socket } from 'socket.io';
import { Logger } from 'winston';
import { LiveData } from '@/scraper/openapi/liveData.service';

@WebSocketGateway({
  namespace: '/api/stock/realtime',
  pingInterval: 5000,
  pingTimeout: 5000,
})
@Injectable()
export class StockGateway {
  @WebSocketServer()
  server: Server;
  private readonly mutex = new Mutex();

  constructor(
    private readonly liveData: LiveData,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @SubscribeMessage('connectStock')
  async handleConnectStock(
    @MessageBody() stockId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(stockId);

    await this.mutex.runExclusive(async () => {
      const connectedSockets = await this.server.to(stockId).fetchSockets();

      if (connectedSockets.length > 0 && !this.liveData.isSubscribe(stockId)) {
        await this.liveData.subscribe(stockId);
        this.logger.info(`${stockId} is subscribed`);
      }
    });

    client.on('disconnecting', () => {
      client.rooms.delete(client.id);
      const stocks = Array.from(client.rooms.values());
      for (const stock of stocks) {
        this.handleDisconnectStock(stock);
      }
    });

    client.emit('connectionSuccess', {
      message: `Successfully connected to stock room: ${stockId}`,
      stockId,
    });
  }

  async handleDisconnectStock(stockId: string) {
    await this.mutex.runExclusive(async () => {
      const connectedSockets = await this.server.in(stockId).fetchSockets();

      if (connectedSockets.length === 0) {
        await this.liveData.unsubscribe(stockId);
        this.logger.info(`${stockId} is unsubscribed`);
      }
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
