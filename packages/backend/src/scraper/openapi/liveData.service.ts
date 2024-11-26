import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Logger } from 'winston';
import { RawData, WebSocket } from 'ws';
import { OpenapiLiveData } from './api/openapiLiveData.api';
import { OpenapiTokenApi } from './api/openapiToken.api';
import { openApiConfig } from './config/openapi.config';
import { parseMessage } from './parse/openapi.parser';
import { WebsocketClient } from './websocket/websocketClient.websocket';

type TR_IDS = '0' | '1';

@Injectable()
export class LiveData {
  private readonly clientStock: Set<string> = new Set();
  private readonly reconnectInterval = 60 * 1000 * 1000;

  private readonly startTime: Date = new Date(2024, 0, 1, 9, 0, 0, 0);
  private readonly endTime: Date = new Date(2024, 0, 1, 15, 30, 0, 0);
  constructor(
    private readonly openApiToken: OpenapiTokenApi,
    private readonly webSocketClient: WebsocketClient,
    private readonly openapiLiveData: OpenapiLiveData,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.connect();
    this.subscribe('000020');
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
        this.openapiLiveData.saveLiveData([stockLiveData]);
      }
    } catch (error) {
      this.logger.warn(`Subscribe error in open api : ${error}`);
    }
  }

  async subscribe(stockId: string) {
    if (this.isCloseTime(new Date(), this.startTime, this.endTime)) {
      await this.openapiSubscribe(stockId);
    } else {
      // TODO : 하나의 config만 사용중.
      this.clientStock.add(stockId);
      const message = this.convertObjectToMessage(
        (await this.openApiToken.configs())[0],
        stockId,
        '1',
      );
      this.webSocketClient.subscribe(message);
    }
  }

  async discribe(stockId: string) {
    if (this.clientStock.has(stockId)) {
      this.clientStock.delete(stockId);
      const message = this.convertObjectToMessage(
        (await this.openApiToken.configs())[0],
        stockId,
        '0',
      );
      this.webSocketClient.discribe(message);
    }
  }

  private initOpenCallback =
    (sendMessage: (message: string) => void) => async () => {
      this.logger.info('WebSocket connection established');
      for (const stockId of this.clientStock.keys()) {
        const message = this.convertObjectToMessage(
          (await this.openApiToken.configs())[0],
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
          }
          return;
        }
        const liveData = this.openapiLiveData.convertLiveData(message);
        await this.openapiLiveData.saveLiveData(liveData);
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
    this.webSocketClient.connectPacade(
      this.initOpenCallback,
      this.initMessageCallback,
      this.initCloseCallback,
      this.initErrorCallback,
    );
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
