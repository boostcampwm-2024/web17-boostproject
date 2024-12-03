import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { RawData, WebSocket } from 'ws';

@Injectable()
export class WebsocketClient {
  static url = process.env.WS_URL ?? 'ws://ops.koreainvestment.com:21000';
  private client: WebSocket;
  private messageQueue: string[] = [];

  constructor(@Inject('winston') private readonly logger: Logger) {
    this.client = new WebSocket(WebsocketClient.url);
    this.initOpen(() => this.flushQueue());
    this.initError((error) => this.logger.error('WebSocket error', error));
  }

  static websocketFactory(logger: Logger) {
    return new WebsocketClient(logger);
  }

  subscribe(message: string) {
    this.sendMessage(message);
  }

  unsubscribe(message: string) {
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
    this.initOpen(initOpenCallback(this.sendMessage.bind(this)));
    this.initMessage(initMessageCallback(this.client));
    this.initDisconnect(initCloseCallback);
    this.initError(initErrorCallback);
  }

  private sendMessage(message: string) {
    if (this.client.readyState === WebSocket.OPEN) {
      this.client.send(message);
      this.logger.info(`Sent message: ${message}`);
    } else {
      this.logger.warn('WebSocket not open. Queueing message.');
      this.messageQueue.push(message); // 큐에 메시지를 추가
    }
  }

  private flushQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }
}
