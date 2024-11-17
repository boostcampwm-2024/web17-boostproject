import { Stock } from '@/stock/domain/stock.entity';
import { DataSource, EntityManager } from 'typeorm';
import { openApiToken } from './openapiToken.api';
import { StockDaily } from '@/stock/domain/stockDaily.entity';
import { StockWeekly } from '@/stock/domain/stockWeekly.entity';
import { StockMonthly } from '@/stock/domain/stockMonthly.entity';
import { StockYearly } from '@/stock/domain/stockYearly.entity';
import { StockPeriod } from '@/stock/domain/stockPeriod';
import { getOpenApi, getPreviousDate, getTodayDate } from '../openapiUtil.api';
import { Cron } from '@nestjs/schedule';

type ChartData = {
  stck_bsop_date: string;
  stck_clpr: string;
  stck_oprc: string;
  stck_hgpr: string;
  stck_lwpr: string;
  acml_vol: string;
  acml_tr_pbmn: string;
  flng_cls_code: string;
  prtt_rate: string;
  mod_yn: string;
  prdy_vrss_sign: string;
  prdy_vrss: string;
  revl_issu_reas: string;
};

type Period = 'D' | 'W' | 'M' | 'Y';

const DATE_TO_ENTITY = {
  D: StockDaily,
  W: StockWeekly,
  M: StockMonthly,
  Y: StockYearly,
};

const DATE_TO_MONTH = {
  D: 3,
  W: 6,
  M: 12,
  Y: 24,
};

const INTERVALS = 4000;

export class OpenapiPeriodData {
  private readonly url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice';
  public constructor(private readonly datasourse: DataSource) {
    this.getItemChartPriceCheck();
  }

  @Cron('0 1 * * 1-5')
  public async getItemChartPriceCheck() {
    const entityManager = this.datasourse.manager;
    const stocks = await entityManager.find(Stock);
    const configCount = openApiToken.configs.length;
    const chunkSize = Math.ceil(stocks.length / configCount);

    for (let i = 0; i < configCount; i++) {
      const chunk = stocks.slice(i * chunkSize, (i + 1) * chunkSize);
      this.getChartData(chunk, 'D');
      setTimeout(() => this.getChartData(chunk, 'W'), INTERVALS);
      setTimeout(() => this.getChartData(chunk, 'M'), INTERVALS * 2);
      setTimeout(() => this.getChartData(chunk, 'Y'), INTERVALS * 3);
    }
  }

  private async getChartData(chunk: Stock[], period: Period) {
    const baseTime = INTERVALS * 4;
    const entity = DATE_TO_ENTITY[period];
    const manager = this.datasourse.manager;
    const stockPeriod = new StockPeriod();

    let time = 0;
    for (const stock of chunk) {
      let configIdx = 0;
      time += baseTime;

      setTimeout(async () => {
        let endDate = getTodayDate();
        let startDate = getPreviousDate(endDate, 3);
        let isFail = false;
        while (!isFail) {
          configIdx = (configIdx + 1) % openApiToken.configs.length;
          stockPeriod.stock = { id: stock.id } as Stock;
          stockPeriod.start_time = new Date(
            parseInt(endDate.slice(0, 4)),
            parseInt(endDate.slice(4, 6)) - 1,
            parseInt(endDate.slice(6, 8)),
          );
          if (await this.existsChartData(stockPeriod, manager, entity)) {
            return;
          }
          const query = this.getItemChartPriceQuery(
            stock.id!,
            startDate,
            endDate,
            period,
          );
          const output = (
            await getOpenApi(this.url, openApiToken.configs[configIdx], query)
          ).output2;
          if (output && this.isChartData(output[0])) {
            await this.saveChartData(entity, stock.id!, output);
            endDate = getPreviousDate(startDate, DATE_TO_MONTH[period]);
            startDate = getPreviousDate(endDate, DATE_TO_MONTH[period]);
          } else {
            isFail = true;
          }
        }
      }, time);
    }
  }

  private async existsChartData(
    stock: StockPeriod,
    manager: EntityManager,
    entity: typeof StockPeriod,
  ) {
    return await manager.findOne(entity, {
      where: {
        stock: { id: stock.stock.id },
        created_at: stock.start_time,
      },
    });
  }

  private async insertChartData(
    stock: StockPeriod,
    entity: typeof StockPeriod,
  ) {
    const manager = this.datasourse.manager;
    if (!(await this.existsChartData(stock, manager, entity))) {
      await manager.save(entity, stock);
    }
  }

  private async saveChartData(
    entity: typeof StockPeriod,
    stockId: string,
    data: ChartData[],
  ) {
    for (const item of data) {
      if (!item || !item.stck_bsop_date) {
        continue;
      }
      const stockPeriod = new StockPeriod();
      stockPeriod.stock = { id: stockId } as Stock;
      stockPeriod.start_time = new Date(
        parseInt(item.stck_bsop_date.slice(0, 4)),
        parseInt(item.stck_bsop_date.slice(4, 6)) - 1,
        parseInt(item.stck_bsop_date.slice(6, 8)),
      );
      stockPeriod.close = parseInt(item.stck_clpr);
      stockPeriod.open = parseInt(item.stck_oprc);
      stockPeriod.high = parseInt(item.stck_hgpr);
      stockPeriod.low = parseInt(item.stck_lwpr);
      stockPeriod.volume = BigInt(item.acml_vol);
      stockPeriod.created_at = new Date();
      await this.insertChartData(stockPeriod, entity);
    }
  }

  private getItemChartPriceQuery(
    stockId: string,
    startDate: string,
    endDate: string,
    period: Period,
    marketCode: 'J' | 'W' = 'J',
  ): any {
    return {
      fid_cond_mrkt_div_code: marketCode,
      fid_input_iscd: stockId,
      fid_input_date_1: startDate,
      fid_input_date_2: endDate,
      fid_period_div_code: period,
      fid_org_adj_prc: 0,
    };
  }

  private isChartData(data: any) {
    return (
      typeof data.stck_bsop_date === 'string' &&
      typeof data.stck_clpr === 'string' &&
      typeof data.stck_oprc === 'string' &&
      typeof data.stck_hgpr === 'string' &&
      typeof data.stck_lwpr === 'string' &&
      typeof data.acml_vol === 'string' &&
      typeof data.acml_tr_pbmn === 'string' &&
      typeof data.flng_cls_code === 'string' &&
      typeof data.prtt_rate === 'string' &&
      typeof data.mod_yn === 'string' &&
      typeof data.prdy_vrss_sign === 'string' &&
      typeof data.prdy_vrss === 'string' &&
      typeof data.revl_issu_reas === 'string'
    );
  }
}
