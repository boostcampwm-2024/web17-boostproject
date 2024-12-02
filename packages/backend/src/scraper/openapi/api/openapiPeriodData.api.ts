import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import {
  ChartData,
  isChartData,
  ItemChartPriceQuery,
  Period,
} from '../type/openapiPeriodData.type';
import { TR_IDS } from '../type/openapiUtil.type';
import { NewDate } from '../util/newDate.util';
import {
  getOpenApi,
  getPreviousDate,
  getTodayDate,
} from '../util/openapiUtil.api';
import { OpenapiTokenApi } from './openapiToken.api';
import { Json, OpenapiQueue } from '@/scraper/openapi/queue/openapi.queue';
import { Stock } from '@/stock/domain/stock.entity';
import {
  StockDaily,
  StockData,
  StockMonthly,
  StockWeekly,
  StockYearly,
} from '@/stock/domain/stockData.entity';

const DATE_TO_ENTITY = {
  D: StockDaily,
  W: StockWeekly,
  M: StockMonthly,
  Y: StockYearly,
} as const;

const DATE_TO_MONTH = {
  D: 1,
  W: 6,
  M: 24,
  Y: 120,
} as const;

const INTERVALS = 10000;

@Injectable()
export class OpenapiPeriodData {
  private readonly url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice';
  constructor(
    private readonly datasource: DataSource,
    private readonly openApiToken: OpenapiTokenApi,
    private readonly openApiQueue: OpenapiQueue,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.getItemChartPriceCheck();
  }

  @Cron('0 1 * * 1-5')
  async getItemChartPriceCheck() {
    if (process.env.NODE_ENV !== 'production') return;
    const stocks = await this.datasource.manager.find(Stock, {
      where: {
        isTrading: true,
      },
    });
    await this.getChartData(stocks, 'Y');
    //await this.getChartData(stocks, 'M');
    //await this.getChartData(stocks, 'W');
    //await this.getChartData(stocks, 'D');
  }

  /**
   * 월, 년의 경우 마지막 데이터를 업데이트 하는 형식으로 변경해야됨
   */
  private getLiveDataSaveCallback(stockId: string, period: Period) {
    return async (data: Json) => {
      console.log(stockId);
      if (!data.output2 || !Array.isArray(data.output2)) return;
      // 이거 빈값들어오는 케이스 있음(빈값 필터링 안하면 요청이 매우 많아짐)
      data.output2 = data.output2.filter(
        (data) => Object.keys(data).length !== 0,
      );
      if (data.output2.length === 0) return;
      await this.saveChartData(period, stockId, data.output2 as ChartData[]);
    };
  }

  /* eslint-disable-next-line max-lines-per-function */
  private getLiveDataSaveUntilEndCallback(
    stockId: string,
    period: Period,
    end: string,
  ) {
    /* eslint-disable-next-line max-lines-per-function */
    return async (data: Json) => {
      if (!data.output2 || !Array.isArray(data.output2)) return;
      // 이거 빈값들어오는 케이스 있음(빈값 필터링 안하면 요청이 매우 많아짐)
      data.output2 = data.output2.filter(
        (data) => Object.keys(data).length !== 0,
      );
      if (data.output2.length === 0) return;
      await this.saveChartData(period, stockId, data.output2 as ChartData[]);
      const { endDate, startDate } = this.updateDates(end, period);
      const query = this.getItemChartPriceQuery(
        stockId,
        startDate,
        endDate,
        period,
      );
      this.openApiQueue.enqueue({
        url: this.url,
        query,
        trId: TR_IDS.ITEM_CHART_PRICE,
        callback: this.getLiveDataSaveUntilEndCallback(
          stockId,
          period,
          endDate,
        ),
      });
    };
  }

  private async getChartData(chunk: Stock[], period: Period) {
    for (const stock of chunk) {
      await this.processStockData(stock, period);
    }
  }

  private async processStockData(stock: Stock, period: Period) {
    const end = getTodayDate();
    const start = getPreviousDate(end, DATE_TO_MONTH[period]);

    const query = this.getItemChartPriceQuery(stock.id!, start, end, period);

    this.openApiQueue.enqueue({
      url: this.url,
      query,
      trId: TR_IDS.ITEM_CHART_PRICE,
      callback: this.getLiveDataSaveCallback(stock.id!, period),
    });
  }

  private async fetchChartData(query: ItemChartPriceQuery, configIdx: number) {
    try {
      const response = await getOpenApi(
        this.url,
        (await this.openApiToken.configs())[configIdx],
        query,
        TR_IDS.ITEM_CHART_PRICE,
      );
      return response.output2 as ChartData[];
    } catch (error) {
      this.logger.warn(error);
      setTimeout(() => this.fetchChartData(query, configIdx), INTERVALS / 10);
    }
  }

  private updateDates(
    endDate: string,
    period: Period,
  ): { endDate: string; startDate: string } {
    endDate = getPreviousDate(endDate, DATE_TO_MONTH[period]);
    const startDate = getPreviousDate(endDate, DATE_TO_MONTH[period]);
    return { endDate, startDate };
  }

  private async existsChartData(stock: StockData, entity: typeof StockData) {
    const manager = this.datasource.manager;
    return await manager.findOne(entity, {
      where: {
        stock: { id: stock.stock.id },
        startTime: stock.startTime,
      },
    });
  }

  private isSamePeriod(stock: StockData, period: Period) {
    return (
      (period === 'W' && new NewDate(stock.startTime).isSameWeek(new Date())) ||
      (period === 'M' &&
        new NewDate(stock.startTime).isSameMonth(new Date())) ||
      (period === 'Y' && new NewDate(stock.startTime).isSameYear(new Date()))
    );
  }

  private async insertChartData(stock: StockData, period: Period) {
    const entity = DATE_TO_ENTITY[period];
    const manager = this.datasource.manager;

    //로직 변경
    if (this.isSamePeriod(stock, period)) {
      const pastOneData = await manager
        .createQueryBuilder()
        .from(entity, 'stock')
        .limit(1)
        .orderBy('stock.start_time', 'DESC')
        .execute();
      await manager.update(entity, pastOneData.id, stock);
      return;
    }
    if (!(await this.existsChartData(stock, entity))) {
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
    period: Period,
    stockId: string,
    data: ChartData[],
  ) {
    for (const item of data) {
      if (!isChartData(item)) {
        continue;
      }
      const stockPeriod = this.convertObjectToStockData(item, stockId);
      console.log(stockPeriod);
      await this.insertChartData(stockPeriod, period);
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
