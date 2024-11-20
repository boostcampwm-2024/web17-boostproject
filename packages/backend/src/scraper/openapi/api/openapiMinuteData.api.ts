import { Injectable, UseFilters } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { openApiConfig } from '../config/openapi.config';
import { OpenapiExceptionFilter } from '../Decorator/openapiException.filter';
import {
  isMinuteData,
  MinuteData,
  UpdateStockQuery,
} from '../type/openapiMinuteData.type';
import { TR_IDS } from '../type/openapiUtil.type';
import { getCurrentTime, getOpenApi } from '../util/openapiUtil.api';
import { openApiToken } from './openapiToken.api';
import { Stock } from '@/stock/domain/stock.entity';
import { StockData, StockMinutely } from '@/stock/domain/stockData.entity';

const STOCK_CUT = 4;

@Injectable()
export class OpenapiMinuteData {
  private stock: Stock[][] = [];
  private readonly entity = StockMinutely;
  private readonly url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice';
  private readonly intervals: number = 130;
  private flip: number = 0;
  public constructor(private readonly datasource: DataSource) {
    this.getStockData();
  }

  @Cron('0 1 * * 1-5')
  @UseFilters(OpenapiExceptionFilter)
  private async getStockData() {
    if (process.env.NODE_ENV !== 'production') return;
    const stock = await this.datasource.manager.findBy(Stock, {
      isTrading: true,
    });
    const stockSize = Math.ceil(stock.length / STOCK_CUT);
    let i = 0;
    this.stock = [];
    while (i < STOCK_CUT) {
      this.stock.push(stock.slice(i * stockSize, (i + 1) * stockSize));
      i++;
    }
    console.log(stock.length);
    console.log(this.stock.length);
    console.log(this.stock[0].length);
  }

  private convertResToMinuteData(stockId: string, item: MinuteData) {
    const stockPeriod = new StockData();
    stockPeriod.stock = { id: stockId } as Stock;
    stockPeriod.startTime = new Date(
      parseInt(item.stck_bsop_date.slice(0, 4)),
      parseInt(item.stck_bsop_date.slice(4, 6)) - 1,
      parseInt(item.stck_bsop_date.slice(6, 8)),
    );
    stockPeriod.close = parseInt(item.stck_prpr);
    stockPeriod.open = parseInt(item.stck_oprc);
    stockPeriod.high = parseInt(item.stck_hgpr);
    stockPeriod.low = parseInt(item.stck_lwpr);
    stockPeriod.volume = parseInt(item.cntg_vol);
    stockPeriod.createdAt = new Date();
    return stockPeriod;
  }

  private async saveMinuteData(stockId: string, item: MinuteData[]) {
    const manager = this.datasource.manager;
    const stockPeriod = item.map((val) =>
      this.convertResToMinuteData(stockId, val),
    );
    manager.save(this.entity, stockPeriod);
  }

  private async getMinuteDataInterval(
    stockId: string,
    time: string,
    config: typeof openApiConfig,
  ) {
    const query = this.getUpdateStockQuery(stockId, time);
    console.log(query);
    try {
      const response = await getOpenApi(
        this.url,
        config,
        query,
        TR_IDS.MINUTE_DATA,
      );
      let output;
      if (response.output2) output = response.output2;
      if (output && output[0] && isMinuteData(output[0])) {
        this.saveMinuteData(stockId, output);
      }
    } catch (error) {
      console.error(error);
    }
  }

  @UseFilters(OpenapiExceptionFilter)
  private async getMinuteDataChunk(
    chunk: Stock[],
    config: typeof openApiConfig,
  ) {
    const time = getCurrentTime();
    let interval = 0;
    for await (const stock of chunk) {
      setTimeout(
        () => this.getMinuteDataInterval(stock.id!, time, config),
        interval,
      );
      interval += this.intervals;
    }
  }

  @Cron(`*/${STOCK_CUT} 9-15 * * 1-5`)
  @UseFilters(OpenapiExceptionFilter)
  private getMinuteData() {
    console.error('hello');
    if (process.env.NODE_ENV !== 'production') return;
    console.error('not hello');
    const configCount = openApiToken.configs.length;
    const stock = this.stock[this.flip % STOCK_CUT];
    this.flip++;
    const chunkSize = Math.ceil(stock.length / configCount);
    for (let i = 0; i < configCount; i++) {
      const chunk = stock.slice(i * chunkSize, (i + 1) * chunkSize);
      this.getMinuteDataChunk(chunk, openApiToken.configs[i]);
    }
  }

  private getUpdateStockQuery(
    stockId: string,
    time: string,
    isPastData: boolean = true,
    marketCode: 'J' | 'W' = 'J',
  ): UpdateStockQuery {
    return {
      fid_etc_cls_code: '',
      fid_cond_mrkt_div_code: marketCode,
      fid_input_iscd: stockId,
      fid_input_hour_1: time,
      fid_pw_data_incu_yn: isPastData ? 'Y' : 'N',
    };
  }
}
