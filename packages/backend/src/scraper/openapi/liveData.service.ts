import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Logger } from 'winston';
import { RawData, WebSocket } from 'ws';
import { OpenapiLiveData } from './api/openapiLiveData.api';
import { OpenapiTokenApi } from './api/openapiToken.api';
import { openApiConfig } from './config/openapi.config';
import { parseMessage } from './parse/openapi.parser';
import { WebsocketClient } from './websocket/websocketClient.websocket';

type TR_IDS = '1' | '2';

@Injectable()
export class LiveData {
  private readonly startTime: Date = new Date(2024, 0, 1, 9, 0, 0, 0);
  private readonly endTime: Date = new Date(2024, 0, 1, 15, 30, 0, 0);

  private readonly reconnectInterval = 60 * 1000;
  private readonly subscribeStocks: Map<string, number> = new Map();

  private readonly SOCKET_LIMITS: number = 41;

  private websocketClient: WebsocketClient[] = [];
  private configSubscribeSize: number[] = [];
  constructor(
    private readonly openApiToken: OpenapiTokenApi,
    private readonly openapiLiveData: OpenapiLiveData,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.openApiToken.configs().then((config) => {
      let len = config.length;
      while (len--) {
        this.websocketClient.push(
          WebsocketClient.websocketFactory(this.logger),
        );
        this.configSubscribeSize.push(0);
      }
      this.connect();
    });
  }

  private async openapiSubscribe(stockId: string) {
    const config = (await this.openApiToken.configs())[0];
    const result = await this.openapiLiveData.connectLiveData(stockId, config);
    try {
      const stockLiveData = this.openapiLiveData.convertResponseToStockLiveData(
        result.output,
        stockId,
      );
      if (stockLiveData) {
        await this.openapiLiveData.saveLiveData(stockLiveData);
      }
    } catch (error) {
      this.logger.warn(`Subscribe error in open api : ${error}`);
    }
  }

  isSubscribe(stockId: string) {
    return Object.keys(this.subscribeStocks).some((val) => val === stockId);
  }

  async subscribe(stockId: string) {
    if (stockId === null || stockId === undefined) {
      return;
    }
    await this.openapiSubscribe(stockId);

    if (!this.isCloseTime(new Date(), this.startTime, this.endTime)) {
      for (const [idx, size] of this.configSubscribeSize.entries()) {
        if (size >= this.SOCKET_LIMITS) continue;

        this.configSubscribeSize[idx]++;
        this.subscribeStocks.set(stockId, idx);
        const message = this.convertObjectToMessage(
          (await this.openApiToken.configs())[idx],
          stockId,
          '1',
        );
        this.websocketClient[idx].subscribe(message);
        return;
      }
      this.logger.warn(`Websocket register oversize : ${stockId}`);
    }
  }

  async unsubscribe(stockId: string) {
    if (this.subscribeStocks.has(stockId)) {
      const idx = this.subscribeStocks.get(stockId);
      this.subscribeStocks.delete(stockId);

      if (idx !== undefined) {
        this.configSubscribeSize[idx]--;
      } else {
        this.logger.warn(`Websocket error : ${stockId} has invalid idx`);
        return;
      }

      const message = this.convertObjectToMessage(
        (await this.openApiToken.configs())[idx],
        stockId,
        '2',
      );

      this.websocketClient[idx].unsubscribe(message);
    }
  }

  private initOpenCallback =
    (idx: number) => (sendMessage: (message: string) => void) => async () => {
      this.logger.info('WebSocket connection established');
      for (const stockId of this.subscribeStocks.keys()) {
        const message = this.convertObjectToMessage(
          (await this.openApiToken.configs())[idx],
          stockId,
          '1',
        );
        sendMessage(message);
      }
    };

  private initMessageCallback =
    (client: WebSocket) => async (data: RawData) => {
      try {
        const message = this.parseMessage(data);
        if (message.header) {
          if (message.header.tr_id === 'PINGPONG') {
            client.pong(data);
          } else {
            this.logger.info(JSON.stringify(message));
          }
          return;
        }
        const liveData = this.openapiLiveData.convertLiveData(message);
        this.logger.info(JSON.stringify(liveData[0]));
        await this.openapiLiveData.saveLiveData(liveData[0]);
      } catch (error) {
        this.logger.warn(error);
      }
    };

  private initCloseCallback = () => {
    this.logger.warn(
      `WebSocket connection closed. Reconnecting in ${this.reconnectInterval / 60 / 1000} minute...`,
    );
  };

  private initErrorCallback = (error: unknown) => {
    if (error instanceof Error) {
      this.logger.error(`WebSocket error: ${error.message}`);
    } else {
      this.logger.error('WebSocket error: callback function');
    }
    setTimeout(() => this.connect(), this.reconnectInterval);
  };

  private isCloseTime(date: Date, start: Date, end: Date): boolean {
    const dateMinutes = date.getHours() * 60 + date.getMinutes();
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();

    return dateMinutes <= startMinutes || dateMinutes >= endMinutes;
  }

  @Cron('0 2 * * 1-5')
  connect() {
    this.websocketClient.forEach((socket, idx) => {
      socket.connectFacade(
        this.initOpenCallback(idx),
        this.initMessageCallback,
        this.initCloseCallback,
        this.initErrorCallback,
      );
    });
  }

  private convertObjectToMessage(
    config: typeof openApiConfig,
    stockId: string,
    tr_type: TR_IDS,
  ): string {
    const message = {
      header: {
        approval_key: config.STOCK_WEBSOCKET_KEY!,
        custtype: 'P',
        tr_type,
        'content-type': 'utf-8',
      },
      body: {
        input: {
          tr_id: 'H0STCNT0',
          tr_key: stockId,
        },
      },
    };
    return JSON.stringify(message);
  }

  //TODO : type narrowing 필요
  private parseMessage(data: RawData) {
    if (typeof data === 'object' && !(data instanceof Buffer)) {
      return data;
    } else if (typeof data === 'object') {
      return parseMessage(data.toString());
    } else {
      return parseMessage(data as string);
    }
  }
}
