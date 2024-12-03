import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import {
  Json,
  OpenapiQueue,
  OpenapiQueueNodeValue,
} from '../queue/openapi.queue';
import {
  isMinuteData,
  MinuteData,
  UpdateStockQuery,
} from '../type/openapiMinuteData.type';
import { TR_IDS } from '../type/openapiUtil.type';
import { getCurrentTime } from '../util/openapiUtil.api';
import { Alarm } from '@/alarm/domain/alarm.entity';
import { Stock } from '@/stock/domain/stock.entity';
import { StockData, StockMinutely } from '@/stock/domain/stockData.entity';

@Injectable()
export class OpenapiMinuteData {
  private readonly entity = StockMinutely;
  private readonly url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice';
  constructor(
    private readonly datasource: DataSource,
    private readonly openapiQueue: OpenapiQueue,
  ) {
    this.getStockMinuteData();
  }

  @Cron(`* 9-15 * * 1-5`)
  async getStockMinuteData() {
    if (process.env.NODE_ENV !== 'production') return;
    const alarms = await this.datasource.manager
      .getRepository(Alarm)
      .createQueryBuilder('alarm')
      .leftJoin('alarm.stock', 'stock')
      .select('stock.id', 'stockId')
      .addSelect('COUNT(alarm.id)', 'alarmCount')
      .groupBy('stock.id')
      .orderBy('alarmCount', 'DESC')
      .execute();
    console.log(alarms);
    for (const alarm of alarms) {
      const time = getCurrentTime();
      const query = this.getUpdateStockQuery(alarm.stockId, time);
      const node: OpenapiQueueNodeValue = {
        url: this.url,
        query,
        trId: TR_IDS.MINUTE_DATA,
        callback: this.getStockMinuteDataCallback(alarm.stockId, time),
      };
      this.openapiQueue.enqueue(node);
    }
  }

  getStockMinuteDataCallback(stockId: string, time: string) {
    return async (data: Json) => {
      let output;
      if (data.output2) output = data.output2;
      if (output && output[0] && isMinuteData(output[0])) {
        console.log(output);
        this.saveMinuteData(stockId, output as MinuteData[], time);
      }
    };
  }

  private async saveMinuteData(
    stockId: string,
    item: MinuteData[],
    time: string,
  ) {
    if (!this.isMarketOpenTime(time)) return;
    const stockPeriod = item.map((val) =>
      this.convertResToMinuteData(stockId, val, time),
    );
    for (const stock of stockPeriod) {
      this.datasource.manager
        .createQueryBuilder()
        .insert()
        .into(this.entity)
        .values(stock)
        .orUpdate(
          ['id', 'close', 'low', 'high', 'open', 'volume', 'created_at'],
          ['stock_id', 'start_time'],
        )
        .execute();
    }
    //this.datasource.manager.save(this.entity, stockPeriod);
  }

  private convertResToMinuteData(
    stockId: string,
    item: MinuteData,
    time: string,
  ) {
    const stockPeriod = new StockData();
    stockPeriod.stock = { id: stockId } as Stock;
    stockPeriod.startTime = new Date(
      parseInt(item.stck_bsop_date.slice(0, 4)),
      parseInt(item.stck_bsop_date.slice(4, 6)) - 1,
      parseInt(item.stck_bsop_date.slice(6, 8)),
      parseInt(time.slice(0, 2)),
      parseInt(time.slice(2, 4)),
    );
    stockPeriod.close = parseInt(item.stck_prpr);
    stockPeriod.open = parseInt(item.stck_oprc);
    stockPeriod.high = parseInt(item.stck_hgpr);
    stockPeriod.low = parseInt(item.stck_lwpr);
    stockPeriod.volume = parseInt(item.cntg_vol);
    stockPeriod.createdAt = new Date();
    return stockPeriod;
  }

  private isMarketOpenTime(time: string) {
    const numberTime = parseInt(time);
    // 이거 바꿔놓음
    return numberTime >= 90000 && numberTime <= 183000;
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
