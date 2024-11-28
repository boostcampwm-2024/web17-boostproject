/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { RawData, WebSocket } from 'ws';

@Injectable()
export class WebsocketClient {
  static url = process.env.WS_URL ?? 'ws://ops.koreainvestment.com:21000';
  private client: WebSocket;
  //현재 factory 패턴을 이용해 할당하면 socket이 열리기 전에 message가 가는 문제가 있음.
  // 소켓이 할당되기 전에(client에 소켓이 없을 때) message를 보내려 시도함.

  constructor(@Inject('winston') private readonly logger: Logger) {
    this.client = new WebSocket(WebsocketClient.url);
  }

  static websocketFactory(logger: Logger) {
    const websocket = new WebsocketClient(logger);

    return websocket;
  }

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
    if (!this.client || !this.client.readyState) {
      this.logger.warn('WebSocket is not open. Message not sent. ');
      return;
    }
    if (this.client.readyState === WebSocket.OPEN) {
      this.client.send(message);
      this.logger.info(`Sent message: ${message}`);
    } else {
      this.logger.warn('WebSocket is not open. Message not sent. ');
    }
  }
}
