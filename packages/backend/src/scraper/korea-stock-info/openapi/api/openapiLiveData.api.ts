import { Inject } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { openApiConfig } from '../config/openapi.config';
import {
  StockData,
  parseStockData,
  stockDataKeys,
} from '../type/openapiLiveData.type';
import { decryptAES256 } from '../util/openapiUtil.api';
import { openApiToken } from './openapiToken.api';
import { KospiStock } from '@/stock/domain/kospiStock.entity';
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';

export class OpenapiLiveData {
  public readonly TR_ID: string = 'H0STCNT0';
  private readonly WEBSOCKET_MAX: number = 40;
  private readonly FIELD_LENGTH: number = stockDataKeys.length;
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly manager: EntityManager,
  ) {}

  async getMessage(): Promise<string[]> {
    const kospi = await this.getKospiStockId();
    const config = openApiToken.configs;
    const configLength = config.length;
    const ret: string[] = [];

    for (let i = 0; i < configLength; i++) {
      const stocks = kospi.splice(
        i * this.WEBSOCKET_MAX,
        (i + 1) * this.WEBSOCKET_MAX,
      );
      for (const stock of stocks) {
        ret.push(this.convertObjectToMessage(config[i], stock.id!));
      }
    }

    return ret;
  }

  private convertObjectToMessage(
    config: typeof openApiConfig,
    stockId: string,
  ): string {
    const message = {
      header: {
        approval_key: config.STOCK_WEBSOCKET_KEY!,
        custtype: 'P',
        tr_type: '1',
        'content-type': 'utf-8',
      },
      body: {
        input: {
          tr_id: this.TR_ID,
          tr_key: stockId,
        },
      },
    };
    return JSON.stringify(message);
  }

  private async getKospiStockId() {
    const kospi = await this.manager.find(KospiStock, {
      where: {
        isKospi: true,
      },
    });
    return kospi;
  }

  private async saveLiveData(data: StockLiveData) {
    await this.manager.save(StockLiveData, data);
  }

  private convertLiveData(message: string[]): StockLiveData {
    const stockData: StockData = parseStockData(message);
    const stockLiveData = new StockLiveData();
    stockLiveData.currentPrice = parseFloat(stockData.STCK_PRPR);
    stockLiveData.changeRate = parseFloat(stockData.PRDY_CTRT);
    stockLiveData.volume = parseInt(stockData.CNTG_VOL);
    stockLiveData.high = parseFloat(stockData.STCK_HGPR);
    stockLiveData.low = parseFloat(stockData.STCK_LWPR);
    stockLiveData.open = parseFloat(stockData.STCK_OPRC);
    stockLiveData.previousClose = parseFloat(stockData.WGHN_AVRG_STCK_PRC);
    stockLiveData.updatedAt = new Date();

    return stockLiveData;
  }

  private parseStockData = (input: string) => {
    const dataBlocks = input.split('|'); // 데이터 구분
    const results = [];
    const size = parseInt(dataBlocks[2]); // 데이터 건수
    const rawData = dataBlocks[3];
    const values = rawData.split('^'); // 필드 구분자 '^'

    for (let i = 0; i < size; i++) {
      //TODO : type narrowing require
      const parsedData: Record<string, string | number | null> = {};
      parsedData['STOCK_ID'] = values[i * this.FIELD_LENGTH];
      stockDataKeys.forEach((field: string, index: number) => {
        const value = values[index + this.FIELD_LENGTH * i];
        if (!value) return (parsedData[field] = null);

        // 숫자형 필드 처리
        if (isNaN(parseInt(value))) {
          parsedData[field] = value; // 문자열 그대로 저장
        } else {
          parsedData[field] = parseFloat(value); // 숫자로 변환
        }
      });
      results.push(parsedData);
    }
    return results;
  };

  public async output(
    message: Record<string, unknown> | string,
    iv?: string,
    key?: string,
  ) {
    const data =
      typeof message === 'string'
        ? message.split('|')
        : JSON.stringify(message);
    if (typeof data !== 'string') {
      if (data[0] == '1' && iv && key)
        data[3] = decryptAES256(data[3], iv, key);
      if (data[1] !== this.TR_ID) return;
      const stockData = data[3].split('^');
      const length = stockData.length / parseInt(data[2]);
      const size = parseInt(data[2]);
      const i = 0;
      while (i < size) {
        const data = stockData.splice(i * length, (i + 1) * length);
        const liveData = this.convertLiveData(data);
        this.saveLiveData(liveData);
      }
    }
  }
}
