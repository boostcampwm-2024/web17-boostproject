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
  private readonly startTime: Date = new Date(2024, 0, 1, 9, 0, 0, 0);
  private readonly endTime: Date = new Date(2024, 0, 1, 15, 30, 0, 0);

  private readonly reconnectInterval = 60 * 1000;
  private readonly clientStock: Map<string, number> = new Map();

  private readonly SOCKET_LIMITS: number = 40;

  private websocketClient: WebsocketClient[] = [];
  private subscribeConfig: number[] = [];
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
        this.subscribeConfig.push(0);
      }
      this.connect();
      const stockIds = [
        '000100',
        '000105',
        '000120',
        '000140',
        '000145',
        '000150',
        '000155',
        '000157',
        '000180',
        '000210',
        '000215',
        '000220',
        '000225',
        '000227',
        '000230',
        '000240',
        '000250',
        '000270',
        '000300',
        '000320',
        '000325',
        '000370',
        '000390',
        '000400',
        '000430',
        '000440',
        '000480',
        '000490',
        '000500',
        '000520',
        '000540',
        '000545',
        '000590',
        '000640',
        '000650',
        '000660',
        '000670',
        '000680',
        '000700',
        '000720',
        '000725',
        '000760',
        '000810',
        '000815',
        '000850',
        '000860',
        '000880',
        '000885',
        '00088K',
        '000890',
        '000910',
        '000950',
        '000970',
        '000990',
        '001000',
        '001020',
        '001040',
        '001045',
        '00104K',
        '001060',
        '001065',
        '001067',
        '001070',
        '001080',
        '001120',
        '001130',
        '001140',
        '001200',
        '001210',
        '001230',
        '001250',
        '001260',
        '001270',
        '001275',
        '001290',
        '001340',
        '001360',
        '001380',
        '001390',
        '001420',
        '001430',
        '001440',
        '001450',
        '001460',
        '001465',
        '001470',
        '001500',
        '001510',
        '001515',
      ];
      stockIds.forEach((val) => this.subscribe(val));
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
        this.openapiLiveData.saveLiveData(stockLiveData);
      }
    } catch (error) {
      this.logger.warn(`Subscribe error in open api : ${error}`);
    }
  }

  async subscribe(stockId: string) {
    if (this.isCloseTime(new Date(), this.startTime, this.endTime)) {
      await this.openapiSubscribe(stockId);
    } else {
      for (const [idx, size] of this.subscribeConfig.entries()) {
        if (size >= this.SOCKET_LIMITS) continue;
        this.clientStock.set(stockId, idx);
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

  async discribe(stockId: string) {
    if (this.clientStock.has(stockId)) {
      const idx = this.clientStock.get(stockId);
      this.clientStock.delete(stockId);
      if (idx) this.subscribeConfig[idx]--;
      else {
        this.logger.warn(`Websocket error : ${stockId} has invalid idx`);
        return;
      }
      const message = this.convertObjectToMessage(
        (await this.openApiToken.configs())[idx],
        stockId,
        '0',
      );
      this.websocketClient[idx].discribe(message);
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
    this.websocketClient.forEach((socket) => {
      socket.connectFacade(
        this.initOpenCallback,
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
