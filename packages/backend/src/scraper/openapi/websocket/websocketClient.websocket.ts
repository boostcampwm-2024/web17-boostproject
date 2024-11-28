/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { RawData, WebSocket } from 'ws';

@Injectable()
export class WebsocketClient {
  private readonly url =
    process.env.WS_URL ?? 'ws://ops.koreainvestment.com:21000';
  private client: WebSocket = new WebSocket(this.url);

  constructor(@Inject('winston') private readonly logger: Logger) {}

  subscribe(message: string) {
    this.sendMessage(message);
  }

  discribe(message: string) {
    this.sendMessage(message);
  }

  private initOpen(fn: () => void) {
    this.client.on('open', fn);
  }

  private initMessage(fn: (data: RawData) => void) {
    this.client.on('message', fn);
  }

  private initDisconnect(initCloseCallback: () => void) {
    this.client.on('close', initCloseCallback);
  }

  private initError(initErrorCallback: (error: unknown) => void) {
    this.client.on('error', initErrorCallback);
  }

  connectFacade(
    initOpenCallback: (fn: (message: string) => void) => () => void,
    initMessageCallback: (client: WebSocket) => (data: RawData) => void,
    initCloseCallback: () => void,
    initErrorCallback: (error: unknown) => void,
  ) {
    this.initOpen(initOpenCallback(this.sendMessage));
    this.initMessage(initMessageCallback(this.client));
    this.initDisconnect(initCloseCallback);
    this.initError(initErrorCallback);
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
