import { Stock } from '@/stock/domain/stock.entity';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { getCurrentTime, getOpenApi } from '../openapiUtil.api';
import { openApiToken } from './openapiToken.api';
import { openApiConfig } from '../config/openapi.config';
import { StockPeriod } from '@/stock/domain/stockPeriod';
import { StockMinutely } from '@/stock/domain/stockMinutely.entity';

type MinuteData = {
  stck_bsop_date: string;
  stck_cntg_hour: string;
  stck_prpr: string;
  stck_oprc: string;
  stck_hgpr: string;
  stck_lwpr: string;
  cntg_vol: string;
  acml_tr_pbmn: string;
};

export class OpenapiMinuteData {
  private stock: Stock[];
  private readonly entity = StockMinutely;
  private readonly url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice';
  public constructor(private readonly datasourse: DataSource) {}

  private isMinuteData(data: any) {
    return (
      typeof data.stck_bsop_date === 'string' &&
      typeof data.stck_cntg_hour === 'string' &&
      typeof data.stck_prpr === 'string' &&
      typeof data.stck_oprc === 'string' &&
      typeof data.stck_hgpr === 'string' &&
      typeof data.stck_lwpr === 'string' &&
      typeof data.cntg_vol === 'string' &&
      typeof data.acml_tr_pbmn === 'string'
    );
  }

  @Cron('0 1 * * 1-5')
  private async getStockData() {
    this.stock = await this.datasourse.manager.findBy(Stock, {
      isTrading: true,
    });
  }

  private convertResToMinuteData(stockId: string, item: MinuteData) {
    const stockPeriod = new StockPeriod();
    stockPeriod.stock = { id: stockId } as Stock;
    stockPeriod.start_time = new Date(
      parseInt(item.stck_bsop_date.slice(0, 4)),
      parseInt(item.stck_bsop_date.slice(4, 6)) - 1,
      parseInt(item.stck_bsop_date.slice(6, 8)),
    );
    stockPeriod.close = parseInt(item.stck_prpr);
    stockPeriod.open = parseInt(item.stck_oprc);
    stockPeriod.high = parseInt(item.stck_hgpr);
    stockPeriod.low = parseInt(item.stck_lwpr);
    stockPeriod.volume = BigInt(item.cntg_vol);
    stockPeriod.created_at = new Date();
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
      if (output && this.isMinuteData(output)) {
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
  ): any {
    return {
      FID_ETC_CLS_CODE: '',
      fid_cond_mrkt_div_code: marketCode,
      fid_input_iscd: stockId,
      FID_INPUT_HOUR_1: time,
      FID_PW_DATA_INCU_YN: isPastData ? 'Y' : 'N',
    };
  }
}
