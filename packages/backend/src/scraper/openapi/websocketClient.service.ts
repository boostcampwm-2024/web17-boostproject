/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WebSocket } from 'ws';

@Injectable()
export class WebsocketClient {
  private client: WebSocket;
  private readonly reconnectInterval = 60000;
  private readonly url =
    process.env.WS_URL ?? 'ws://ops.koreainvestment.com:21000';

  constructor(@Inject('winston') private readonly logger: Logger) {
    this.connect();
  }

  @Cron('0 2 * * 1-5')
  private connect() {
    this.client = new WebSocket(this.url);

    this.client.on('open', () => {
      this.logger.log('WebSocket connection established');
      this.sendMessage('Initial message');
    });

    this.client.on('message', (data: any) => {
      this.logger.log(`Received message: ${data}`);
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

  private sendMessage(message: string) {
    if (this.client.readyState === WebSocket.OPEN) {
      this.client.send(message);
      this.logger.log(`Sent message: ${message}`);
    } else {
      this.logger.warn('WebSocket is not open. Message not sent.');
    }
  }
}
