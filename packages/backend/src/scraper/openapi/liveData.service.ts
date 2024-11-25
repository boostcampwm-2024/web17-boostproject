//TODO :  9시 ~ 3시 반까지는 openapi에서 가져오고, 아니면 websocket으로 가져오기

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
// TODO : 비즈니스 로직을 분리해야함.
@Injectable()
export class LiveData {
  private readonly clientStock: Set<string> = new Set();
  private readonly reconnectInterval = 60 * 1000 * 1000;

  constructor(
    private readonly openApiToken: OpenapiTokenApi,
    private readonly webSocketClient: WebsocketClient,
    private readonly openapiLiveData: OpenapiLiveData,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.connect();
    this.subscribe('000150');
    setTimeout(() => this.discribe('000150'), 15000);
  }

  async subscribe(stockId: string) {
    this.clientStock.add(stockId);
    // TODO : 하나의 config만 사용중.
    const message = this.convertObjectToMessage(
      (await this.openApiToken.configs())[0],
      stockId,
      '1',
    );
    this.webSocketClient.subscribe(message);
  }

  async discribe(stockId: string) {
    this.clientStock.delete(stockId);
    const message = this.convertObjectToMessage(
      (await this.openApiToken.configs())[0],
      stockId,
      '0',
    );
    this.webSocketClient.discribe(message);
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
        console.log(data);
        const message = this.parseMessage(data);
        if (message.header) {
          if (message.header.tr_id === 'PINGPONG') {
            this.logger.info(`Received PING: ${data}`);
            client.pong(data);
          }
          return;
        }
        this.logger.info(`Recived data : ${data}`);
        this.logger.info(`Stock id : ${message[0]['STOCK_ID']}`);
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

  @Cron('0 2 * * 1-5')
  connect() {
    this.webSocketClient.connect(
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
    this.logger.info(JSON.stringify(config));
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
