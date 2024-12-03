import { Inject, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
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
export class StockGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly mutex = new Mutex();

  private readonly users: Map<string, string> = new Map();

  constructor(
    private readonly liveData: LiveData,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @SubscribeMessage('connectStock')
  async handleConnectStock(
    @MessageBody() stockId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      client.join(stockId);
      this.users.set(client.id, stockId);

      await this.mutex.runExclusive(async () => {
        const connectedSockets = await this.server.to(stockId).fetchSockets();

        if (
          connectedSockets.length > 0 &&
          !this.liveData.isSubscribe(stockId)
        ) {
          await this.liveData.subscribe(stockId);
          this.logger.info(`${stockId} is subscribed`);
        }
      });

      client.emit('connectionSuccess', {
        message: `Successfully connected to stock room: ${stockId}`,
        stockId,
      });
    } catch (e) {
      const error = e as Error;
      this.logger.warn(error.message);
      client.emit('error', error.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const stockId = this.users.get(client.id);
    if (stockId) {
      this.logger.info(stockId);
      await this.mutex.runExclusive(async () => {
        this.liveData.unsubscribe(stockId);
        this.users.delete(client.id);
      });
    }
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
