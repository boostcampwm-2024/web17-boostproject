import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource, EntityManager } from 'typeorm';
import { Logger } from 'winston';
import {
  ChartData,
  isChartData,
  ItemChartPriceQuery,
  Period,
} from '../type/openapiPeriodData';
import { TR_IDS } from '../type/openapiUtil.type';
import {
  getOpenApi,
  getPreviousDate,
  getTodayDate,
} from '../util/openapiUtil.api';
import { OpenapiTokenApi } from './openapiToken.api';
import { Stock } from '@/stock/domain/stock.entity';
import {
  StockData,
  StockDaily,
  StockWeekly,
  StockMonthly,
  StockYearly,
} from '@/stock/domain/stockData.entity';

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

@Injectable()
export class OpenapiPeriodData {
  private readonly url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice';
  constructor(
    private readonly datasource: DataSource,
    private readonly openApiToken: OpenapiTokenApi,
    @Inject('winston') private readonly logger: Logger,
  ) {
    //this.getItemChartPriceCheck();
  }

  @Cron('0 1 * * 1-5')
  async getItemChartPriceCheck() {
    if (process.env.NODE_ENV !== 'production') return;
    const stocks = await this.datasource.manager.find(Stock, {
      where: {
        isTrading: true,
      },
    });
    const configCount = this.openApiToken.configs.length;
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

    let time = 0;
    for (const stock of chunk) {
      time += baseTime;
      setTimeout(() => this.processStockData(stock, period, entity), time);
    }
  }

  private async processStockData(
    stock: Stock,
    period: Period,
    entity: typeof StockData,
  ) {
    const stockPeriod = new StockData();
    const manager = this.datasource.manager;
    let configIdx = 0;
    let end = getTodayDate();
    let start = getPreviousDate(end, 3);
    let isFail = false;

    while (!isFail) {
      configIdx = (configIdx + 1) % this.openApiToken.configs.length;
      this.setStockPeriod(stockPeriod, stock.id!, end);

      // chart 데이터가 있는 지 확인 -> 리턴
      if (await this.existsChartData(stockPeriod, manager, entity)) return;

      const query = this.getItemChartPriceQuery(stock.id!, start, end, period);

      const output = await this.fetchChartData(query, configIdx);

      if (output) {
        await this.saveChartData(entity, stock.id!, output);
        ({ endDate: end, startDate: start } = this.updateDates(start, period));
      } else isFail = true;
    }
  }

  private setStockPeriod(
    stockPeriod: StockData,
    stockId: string,
    endDate: string,
  ): void {
    stockPeriod.stock = { id: stockId } as Stock;
    stockPeriod.startTime = new Date(
      parseInt(endDate.slice(0, 4)),
      parseInt(endDate.slice(4, 6)) - 1,
      parseInt(endDate.slice(6, 8)),
    );
  }

  private async fetchChartData(query: ItemChartPriceQuery, configIdx: number) {
    try {
      const response = await getOpenApi(
        this.url,
        this.openApiToken.configs[configIdx],
        query,
        TR_IDS.ITEM_CHART_PRICE,
      );
      return response.output2 as ChartData[];
    } catch (error) {
      this.logger.warn(error);
    }
  }

  private updateDates(
    startDate: string,
    period: Period,
  ): { endDate: string; startDate: string } {
    const endDate = getPreviousDate(startDate, DATE_TO_MONTH[period]);
    startDate = getPreviousDate(endDate, DATE_TO_MONTH[period]);
    return { endDate, startDate };
  }

  private async existsChartData(
    stock: StockData,
    manager: EntityManager,
    entity: typeof StockData,
  ) {
    return await manager.findOne(entity, {
      where: {
        stock: { id: stock.stock.id },
        createdAt: stock.startTime,
      },
    });
  }

  private async insertChartData(stock: StockData, entity: typeof StockData) {
    const manager = this.datasource.manager;
    if (!(await this.existsChartData(stock, manager, entity))) {
      await manager.save(entity, stock);
    }
  }

  private convertObjectToStockData(item: ChartData, stockId: string) {
    const stockPeriod = new StockData();
    stockPeriod.stock = { id: stockId } as Stock;
    stockPeriod.startTime = new Date(
      parseInt(item.stck_bsop_date.slice(0, 4)),
      parseInt(item.stck_bsop_date.slice(4, 6)) - 1,
      parseInt(item.stck_bsop_date.slice(6, 8)),
    );
    stockPeriod.close = parseInt(item.stck_clpr);
    stockPeriod.open = parseInt(item.stck_oprc);
    stockPeriod.high = parseInt(item.stck_hgpr);
    stockPeriod.low = parseInt(item.stck_lwpr);
    stockPeriod.volume = parseInt(item.acml_vol);
    stockPeriod.createdAt = new Date();
    return stockPeriod;
  }

  private async saveChartData(
    entity: typeof StockData,
    stockId: string,
    data: ChartData[],
  ) {
    for (const item of data) {
      if (!isChartData(item)) {
        continue;
      }
      const stockPeriod = this.convertObjectToStockData(item, stockId);
      await this.insertChartData(stockPeriod, entity);
    }
  }

  private getItemChartPriceQuery(
    stockId: string,
    startDate: string,
    endDate: string,
    period: Period,
    marketCode: 'J' | 'W' = 'J',
  ): ItemChartPriceQuery {
    return {
      fid_cond_mrkt_div_code: marketCode,
      fid_input_iscd: stockId,
      fid_input_date_1: startDate,
      fid_input_date_2: endDate,
      fid_period_div_code: period,
      fid_org_adj_prc: 0,
    };
  }
}
