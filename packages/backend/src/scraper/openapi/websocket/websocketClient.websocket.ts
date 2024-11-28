/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { RawData, WebSocket } from 'ws';

@Injectable()
export class WebsocketClient {
  static url = process.env.WS_URL ?? 'ws://ops.koreainvestment.com:21000';
  //현재 factory 패턴을 이용해 할당하면 socket이 열리기 전에 message가 가는 문제가 있음.
  //이를 외부에서 받는 방식으로 변환
  // 소켓이 열리고 나서 open 이벤트가 먼저 발생해서

  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly client: WebSocket,
  ) {}

  static websocketFactory(logger: Logger) {
    const socket = new WebSocket(WebsocketClient.url);
    const websocket = new WebsocketClient(logger, socket);

    return websocket;
  }

  subscribe(message: string) {
    this.sendMessage(message);
  }

  discribe(message: string) {
    this.sendMessage(message);
  }

  private initOpen(fn: () => void) {
    console.log(this.client);
    this.client.on('open', fn);
    //콜백 함수 문제 예상됨.
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
    //비동기 관련 한번 확인하고 시작
    if (
      this.client &&
      this.client.readyState &&
      this.client.readyState === WebSocket.OPEN
    ) {
      this.client.send(message);
      this.logger.info(`Sent message: ${message}`);
    } else {
      this.logger.warn('WebSocket is not open. Message not sent. ');
      setTimeout(() => this.client.send(message), 1000);
    }
  }
}
