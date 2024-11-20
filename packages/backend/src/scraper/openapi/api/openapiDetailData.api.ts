import { UseFilters } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Between, DataSource } from 'typeorm';
import { openApiConfig } from '../config/openapi.config';
import { OpenapiExceptionFilter } from '../Decorator/openapiException.filter';
import {
  DetailDataQuery,
  FinancialData,
  isFinancialData,
  isProductDetail,
  ProductDetail,
  StockDetailQuery,
} from '../type/openapiDetailData.type';
import { TR_IDS } from '../type/openapiUtil.type';
import { getOpenApi } from '../util/openapiUtil.api';
import { openApiToken } from './openapiToken.api';
import { Stock } from '@/stock/domain/stock.entity';
import { StockDaily } from '@/stock/domain/stockData.entity';
import { StockDetail } from '@/stock/domain/stockDetail.entity';

export class OpenapiDetailData {
  private readonly financialUrl: string =
    '/uapi/domestic-stock/v1/finance/financial-ratio';
  private readonly defaultUrl: string =
    '/uapi/domestic-stock/v1/quotations/search-stock-info';
  private readonly incomeUrl: string =
    '/uapi/domestic-stock/v1/finance/income-statement';
  private readonly intervals = 100;
  private readonly config: (typeof openApiConfig)[] = openApiToken.configs;
  constructor(private readonly datasource: DataSource) {}

  @Cron('0 8 * * 1-5')
  @UseFilters(OpenapiExceptionFilter)
  public async getDetailData() {
    if (process.env.NODE_ENV !== 'production') return;
    const entityManager = this.datasource.manager;
    const stocks = await entityManager.find(Stock);
    const configCount = this.config.length;
    const chunkSize = Math.ceil(stocks.length / configCount);

    for (let i = 0; i < configCount; i++) {
      const chunk = stocks.slice(i * chunkSize, (i + 1) * chunkSize);
      this.getDetailDataChunk(chunk, this.config[i]);
    }
  }

  private async saveDetailData(stockDetail: StockDetail) {
    const manager = this.datasource.manager;
    const entity = StockDetail;
    manager.save(entity, stockDetail);
  }

  private async calPer(eps: number): Promise<number> {
    if (eps <= 0) return NaN;
    const manager = this.datasource.manager;
    const latestResult = await manager.find(StockDaily, {
      skip: 0,
      take: 1,
      order: { createdAt: 'desc' },
    });
    const currentPrice = latestResult[0].close;
    const per = currentPrice / eps;

    return per;
  }

  private async calMarketCap(lstg: number) {
    const manager = this.datasource.manager;
    const latestResult = await manager.find(StockDaily, {
      skip: 0,
      take: 1,
      order: { createdAt: 'desc' },
    });
    const currentPrice = latestResult[0].close;
    const marketCap = lstg * currentPrice;
    return marketCap;
  }

  private async get52WeeksLowHigh() {
    const manager = this.datasource.manager;
    const nowDate = new Date();
    const weeksAgoDate = this.getDate52WeeksAgo();
    // 주식의 52주간 일단위 데이터 전체 중에 최고, 최저가를 바탕으로 최저가, 최고가 계산해서 가져오기
    const output = await manager.find(StockDaily, {
      select: ['low', 'high'],
      where: {
        startTime: Between(weeksAgoDate, nowDate),
      },
    });
    const result = output.reduce((prev, cur) => {
      if (prev.low > cur.low) prev.low = cur.low;
      if (prev.high < cur.high) prev.high = cur.high;
      return cur;
    }, new StockDaily());
    return { low: result.low, high: result.high };
  }

  private async makeStockDetailObject(
    output1: FinancialData,
    output2: ProductDetail,
  ): Promise<StockDetail> {
    const result = new StockDetail();
    result.marketCap =
      (await this.calMarketCap(parseInt(output2.lstg_stqt))) + '';
    result.eps = parseInt(output1.eps);
    const { low, high } = await this.get52WeeksLowHigh();
    result.low52w = low;
    result.high52w = high;
    result.eps = parseInt(output1.eps);
    result.per = await this.calPer(parseInt(output1.eps));
    result.updatedAt = new Date();
    return result;
  }

  private async getDetailDataDelay(stock: Stock, conf: typeof openApiConfig) {
    const dataQuery = this.getDetailDataQuery(stock.id!);
    const defaultQuery = this.getDefaultDataQuery(stock.id!);

    // 여기서 가져올 건 eps -> eps와 per 계산하자.
    const output1 = await getOpenApi(
      this.incomeUrl,
      conf,
      dataQuery,
      TR_IDS.FINANCIAL_DATA,
    );
    // 여기서 가져올 건 lstg-stqt - 상장주수를 바탕으로 시가총액 계산, kospi200_item_yn 코스피200종목여부 업데이트
    const output2 = await getOpenApi(
      this.defaultUrl,
      conf,
      defaultQuery,
      TR_IDS.PRODUCTION_DETAIL,
    );

    if (isFinancialData(output1) && isProductDetail(output2)) {
      const stockDetail = await this.makeStockDetailObject(output1, output2);
      this.saveDetailData(stockDetail);
    }
  }

  private async getDetailDataChunk(chunk: Stock[], conf: typeof openApiConfig) {
    let delay = 0;
    for (const stock of chunk) {
      setTimeout(() => this.getDetailDataDelay(stock, conf), delay);
      delay += this.intervals;
    }
  }

  private getDefaultDataQuery(
    stockId: string,
    code: '300' | '301' | '302' | '306' = '300',
  ): StockDetailQuery {
    return {
      pdno: stockId,
      code: code,
    };
  }

  private getDetailDataQuery(
    stockId: string,
    divCode: 'J' = 'J',
    classify: '0' | '1' = '1',
  ): DetailDataQuery {
    return {
      fid_cond_mrkt_div_code: divCode,
      fid_input_iscd: stockId,
      fid_div_cls_code: classify,
    };
  }

  private getDate52WeeksAgo(): Date {
    const today = new Date();
    const weeksAgo = 52 * 7;
    const date52WeeksAgo = new Date(today.setDate(today.getDate() - weeksAgo));
    date52WeeksAgo.setHours(0, 0, 0, 0);
    return date52WeeksAgo;
  }
}
