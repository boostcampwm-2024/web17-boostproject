/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Logger } from 'winston';
import { WebSocket } from 'ws';
import { OpenapiLiveData } from './api/openapiLiveData.api';

@Injectable()
export class WebsocketClient {
  private client: WebSocket;
  private readonly reconnectInterval = 60000;
  private readonly url =
    process.env.WS_URL ?? 'ws://ops.koreainvestment.com:21000';

  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly openapiLiveData: OpenapiLiveData,
  ) {
    this.connect();
  }

  // TODO : subscribe 구조로 리팩토링
  private subscribe() {}

  @Cron('0 2 * * 1-5')
  private connect() {
    this.client = new WebSocket(this.url);

    this.client.on('open', () => {
      this.logger.info('WebSocket connection established');
      this.openapiLiveData.getMessage().then((val) => {
        val.forEach((message) => this.sendMessage(message));
      });
    });

    this.client.on('message', (data: any) => {
      this.logger.info(`Received message: ${data}`);
      const message = JSON.parse(data);
      if (message.header && message.header.tr_id === 'PINGPONG') {
        this.logger.info(`Received PING: ${JSON.stringify(message)}`);
        this.sendPong();
        return;
      }
      if (message.header && message.header.tr_id === 'H0STCNT0') {
        return;
      }
      this.openapiLiveData.output(data);
    });

    this.client.on('close', () => {
      this.logger.warn(
        `WebSocket connection closed. Reconnecting in ${this.reconnectInterval / 60 / 1000} minute...`,
      );
      setTimeout(() => this.connect(), this.reconnectInterval);
    });

    this.client.on('error', (error: any) => {
      this.logger.error(`WebSocket error: ${error.message}`);
    });
  }

  private sendPong() {
    const pongMessage = {
      header: { tr_id: 'PINGPONG', datetime: new Date().toISOString() },
    };
    this.client.send(JSON.stringify(pongMessage));
    this.logger.info(`Sent PONG: ${JSON.stringify(pongMessage)}`);
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
