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

  private async handleJoinToRoom(stockId: string) {
    const connectedSockets = await this.server.to(stockId).fetchSockets();

    if (connectedSockets.length > 0 && !this.liveData.isSubscribe(stockId)) {
      await this.liveData.subscribe(stockId);
      this.logger.info(`${stockId} is subscribed`);
    }
  }

  @SubscribeMessage('connectStock')
  async handleConnectStock(
    @MessageBody() stockId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      client.join(stockId);

      await this.mutex.runExclusive(async () => {
        const beforeStockId = this.users.get(client.id);
        await this.handleClientStockEvent(beforeStockId, client);

        this.users.set(client.id, stockId);
        this.handleJoinToRoom(stockId);
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

  private async handleClientStockEvent(
    stockId: string | undefined,
    client: Socket,
  ) {
    if (stockId !== undefined) {
      client.leave(stockId);
      this.users.delete(client.id);
      const values = Object.values(this.users);
      const isStockIdExists = values.some((value) => stockId === value);
      if (!isStockIdExists) {
        await this.liveData.unsubscribe(stockId);
      }
    }
  }

  async handleDisconnect(client: Socket) {
    const stockId = this.users.get(client.id);
    await this.mutex.runExclusive(async () => {
      await this.handleClientStockEvent(stockId, client);
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
