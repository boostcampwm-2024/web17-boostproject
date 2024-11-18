import { Cron } from '@nestjs/schedule';
import { DataSource, EntityManager } from 'typeorm';
import { getOpenApi, getPreviousDate, getTodayDate } from '../openapiUtil.api';
import {
  ChartData,
  isChartData,
  ItemChartPriceQuery,
  Period,
} from '../type/openapiPeriodData';
import { openApiToken } from './openapiToken.api';
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

export class OpenapiPeriodData {
  private readonly url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice';
  public constructor(private readonly datasourse: DataSource) {
    //this.getItemChartPriceCheck();
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

    let time = 0;
    for (const stock of chunk) {
      time += baseTime;
      setTimeout(
        () => this.processStockData(stock, period, entity, manager),
        time,
      );
    }
  }

  private async processStockData(
    stock: Stock,
    period: Period,
    entity: typeof StockData,
    manager: EntityManager,
  ) {
    const stockPeriod = new StockData();
    let configIdx = 0;
    let end = getTodayDate();
    let start = getPreviousDate(end, 3);
    let isFail = false;

    while (isFail) {
      configIdx = (configIdx + 1) % openApiToken.configs.length;
      this.setStockPeriod(stockPeriod, stock.id!, end);

      if (await this.existsChartData(stockPeriod, manager, entity)) return;

      const query = this.getItemChartPriceQuery(stock.id!, start, end, period);

      const output = await this.fetchChartData(query, configIdx);

      if (output && isChartData(output[0])) {
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

  private async fetchChartData(
    query: ItemChartPriceQuery,
    configIdx: number,
  ): Promise<ChartData[]> {
    const response = await getOpenApi(
      this.url,
      openApiToken.configs[configIdx],
      query,
    );
    return response.output2 as ChartData[];
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
    const manager = this.datasourse.manager;
    if (!(await this.existsChartData(stock, manager, entity))) {
      await manager.save(entity, stock);
    }
  }

  private async saveChartData(
    entity: typeof StockData,
    stockId: string,
    data: ChartData[],
  ) {
    for (const item of data) {
      if (!item || !item.stck_bsop_date) {
        continue;
      }
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
      stockPeriod.volume = BigInt(item.acml_vol);
      stockPeriod.createdAt = new Date();
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
