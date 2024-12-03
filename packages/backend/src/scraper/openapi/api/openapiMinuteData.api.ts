import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import {
  Json,
  OpenapiQueue,
  OpenapiQueueNodeValue,
} from '../queue/openapi.queue';
import {
  isMinuteDataOutput1,
  isMinuteDataOutput2,
  MinuteData,
  MinuteDataOutput1,
  MinuteDataOutput2,
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
  private readonly STOCK_LIMITS: number = 200;
  constructor(
    private readonly datasource: DataSource,
    private readonly openapiQueue: OpenapiQueue,
    @Inject('winston') private readonly logger: Logger,
  ) {}

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
      .limit(this.STOCK_LIMITS)
      .execute();
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
      let output1: MinuteDataOutput1, output2: MinuteDataOutput2[];
      if (data.output1 && isMinuteDataOutput1(data.output1)) {
        output1 = data.output1;
      } else {
        this.logger.info(`${stockId} has invalid minute data`);
        return;
      }
      if (
        data.output2 &&
        data.output2[0] &&
        isMinuteDataOutput2(data.output2[0])
      ) {
        output2 = data.output2 as MinuteDataOutput2[];
      } else {
        this.logger.info(`${stockId} has invalid minute data`);
        return;
      }
      const minuteDatas: MinuteData[] = output2.map((val): MinuteData => {
        return { acml_vol: output1.acml_vol, ...val };
      });
      await this.saveMinuteData(stockId, minuteDatas, time);
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
    if (stockPeriod[0]) {
      this.datasource.manager.upsert(this.entity, stockPeriod[0], [
        'stock.id',
        'startTime',
      ]);
    }
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
    stockPeriod.volume = parseInt(item.acml_vol);
    stockPeriod.createdAt = new Date();
    return stockPeriod;
  }

  private isMarketOpenTime(time: string) {
    const numberTime = parseInt(time);
    return numberTime >= 90000 && numberTime <= 153000;
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
