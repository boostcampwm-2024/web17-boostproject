import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { openApiConfig } from '../config/openapi.config';
import { getCurrentTime, getOpenApi } from '../openapiUtil.api';
import {
  isMinuteData,
  MinuteData,
  UpdateStockQuery,
} from '../type/openapiMinuteData.type';
import { openApiToken } from './openapiToken.api';
import { Stock } from '@/stock/domain/stock.entity';
import { StockData, StockMinutely } from '@/stock/domain/stockData.entity';

@Injectable()
export class OpenapiMinuteData {
  private stock: Stock[];
  private readonly entity = StockMinutely;
  private readonly url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice';
  public constructor(private readonly datasourse: DataSource) {}

  @Cron('0 1 * * 1-5')
  private async getStockData() {
    this.stock = await this.datasourse.manager.findBy(Stock, {
      isTrading: true,
    });
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

  private async saveMinuteData(stockPeriod: StockMinutely) {
    const manager = this.datasourse.manager;
    manager.create(this.entity, stockPeriod);
  }

  private async getMinuteDataChunk(
    chunk: Stock[],
    config: typeof openApiConfig,
  ) {
    for await (const stock of chunk) {
      const time = getCurrentTime();
      const query = this.getUpdateStockQuery(stock.id!, time);
      const response = await getOpenApi(this.url, config, query);
      const output = (await response.data).output2[0] as MinuteData;
      if (output && isMinuteData(output)) {
        const stockPeriod = this.convertResToMinuteData(stock.id!, output);
        this.saveMinuteData(stockPeriod);
      }
    }
  }

  @Cron('* 9-16 * * 1-5')
  private getMinuteData() {
    const configCount = openApiToken.configs.length;
    const chunkSize = Math.ceil(this.stock.length / configCount);

    for (let i = 0; i < configCount; i++) {
      const chunk = this.stock.slice(i * chunkSize, (i + 1) * chunkSize);
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
