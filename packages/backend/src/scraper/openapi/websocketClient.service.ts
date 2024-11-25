/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Logger } from 'winston';
import { RawData, WebSocket } from 'ws';
import { OpenapiLiveData } from './api/openapiLiveData.api';
import { OpenapiTokenApi } from './api/openapiToken.api';
import { openApiConfig } from './config/openapi.config';
import { parseMessage } from './parse/openapi.parser';

type TR_IDS = '0' | '1';

@Injectable()
export class WebsocketClient {
  private client: WebSocket;
  private readonly reconnectInterval = 60000;
  private readonly url =
    process.env.WS_URL ?? 'ws://ops.koreainvestment.com:21000';
  private readonly clientStock: Set<string> = new Set();

  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly openApiToken: OpenapiTokenApi,
    private readonly openapiLiveData: OpenapiLiveData,
  ) {
    if (process.env.NODE_ENV === 'production') {
      this.connect();
    }
  }

  // TODO : subscribe 구조로 리팩토링
  subscribe(stockId: string) {
    this.clientStock.add(stockId);
    // TODO : 하나의 config만 사용중.
    const message = this.convertObjectToMessage(
      this.openApiToken.configs[0],
      stockId,
      '1',
    );
    this.sendMessage(message);
  }

  discribe(stockId: string) {
    this.clientStock.delete(stockId);
    const message = this.convertObjectToMessage(
      this.openApiToken.configs[0],
      stockId,
      '0',
    );
    this.sendMessage(message);
  }

  private initDisconnect() {
    this.client.on('close', () => {
      this.logger.warn(
        `WebSocket connection closed. Reconnecting in ${this.reconnectInterval / 60 / 1000} minute...`,
      );
    });

    this.client.on('error', (error: any) => {
      this.logger.error(`WebSocket error: ${error.message}`);
      setTimeout(() => this.connect(), this.reconnectInterval);
    });
  }

  private initOpen() {
    this.client.on('open', () => {
      this.logger.info('WebSocket connection established');
      for (const stockId of this.clientStock.keys()) {
        const message = this.convertObjectToMessage(
          this.openApiToken.configs[0],
          stockId,
          '1',
        );
        this.sendMessage(message);
      }
    });
  }

  private initMessage() {
    this.client.on('message', async (data: RawData) => {
      try {
        console.log(data);
        const message = this.parseMessage(data);
        if (message.header) {
          if (message.header.tr_id === 'PINGPONG') {
            this.logger.info(`Received PING: ${data}`);
            this.client.pong(data);
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
    });
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

  @Cron('0 2 * * 1-5')
  connect() {
    this.client = new WebSocket(this.url);
    this.initOpen();
    this.initMessage();
    this.initDisconnect();
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

  private sendMessage(message: string) {
    if (this.client.readyState === WebSocket.OPEN) {
      this.client.send(message);
      this.logger.info(`Sent message: ${message}`);
    } else {
      this.logger.warn('WebSocket is not open. Message not sent.');
    }
  }
}
