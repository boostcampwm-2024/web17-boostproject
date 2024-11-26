import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Between, DataSource } from 'typeorm';
import { Logger } from 'winston';
import { openApiConfig } from '../config/openapi.config';
import {
  DetailDataQuery,
  FinancialRatio,
  isFinancialRatioData,
  isProductDetail,
  ProductDetail,
  StockDetailQuery,
} from '../type/openapiDetailData.type';
import { TR_IDS } from '../type/openapiUtil.type';
import { getOpenApi } from '../util/openapiUtil.api';
import { OpenapiTokenApi } from './openapiToken.api';
import { KospiStock } from '@/stock/domain/kospiStock.entity';
import { Stock } from '@/stock/domain/stock.entity';
import { StockDaily } from '@/stock/domain/stockData.entity';
import { StockDetail } from '@/stock/domain/stockDetail.entity';

@Injectable()
export class OpenapiDetailData {
  private readonly financialUrl: string =
    '/uapi/domestic-stock/v1/finance/financial-ratio';
  private readonly productUrl: string =
    '/uapi/domestic-stock/v1/quotations/search-stock-info';
  private readonly intervals = 1000;
  constructor(
    private readonly openApiToken: OpenapiTokenApi,
    private readonly datasource: DataSource,
    @Inject('winston') private readonly logger: Logger,
  ) {
    //this.getDetailData();
  }

  @Cron('0 8 * * 1-5')
  async getDetailData() {
    if (process.env.NODE_ENV !== 'production') return;
    const entityManager = this.datasource.manager;
    const stocks = await entityManager.find(Stock);
    const configCount = (await this.openApiToken.configs()).length;
    const chunkSize = Math.ceil(stocks.length / configCount);

    for (let i = 0; i < configCount; i++) {
      this.logger.info((await this.openApiToken.configs())[i]);
      const chunk = stocks.slice(i * chunkSize, (i + 1) * chunkSize);
      this.getDetailDataChunk(chunk, (await this.openApiToken.configs())[i]);
    }
  }

  private async saveDetailData(stockDetail: StockDetail) {
    const manager = this.datasource.manager;
    const entity = StockDetail;
    const existingStockDetail = await manager.findOne(entity, {
      where: {
        stock: { id: stockDetail.stock.id },
      },
    });
    if (existingStockDetail) {
      manager.update(
        entity,
        { stock: { id: stockDetail.stock.id } },
        stockDetail,
      );
    } else {
      manager.save(entity, stockDetail);
    }
  }

  private async saveKospiData(stockDetail: KospiStock) {
    const manager = this.datasource.manager;
    const entity = KospiStock;
    const existingStockDetail = await manager.findOne(entity, {
      where: {
        stock: { id: stockDetail.stock.id },
      },
    });

    if (existingStockDetail) {
      manager.update(
        entity,
        { stock: { id: stockDetail.stock.id } },
        stockDetail,
      );
    } else {
      manager.save(entity, stockDetail);
    }
  }

  private async calPer(eps: number): Promise<number> {
    if (eps <= 0) return NaN;
    const manager = this.datasource.manager;
    const latestResult = await manager.find(StockDaily, {
      skip: 0,
      take: 1,
      order: { createdAt: 'desc' },
    });
    // TODO : price가 없는 경우 0으로 리턴, 나중에 NaN과 대응되게 리턴
    if (latestResult && latestResult[0] && latestResult[0].close) {
      const currentPrice = latestResult[0].close;
      const per = currentPrice / eps;

      if (isNaN(per)) return 0;
      else return per;
    } else {
      return 0;
    }
  }

  private async calMarketCap(lstg: number) {
    const manager = this.datasource.manager;
    const latestResult = await manager.find(StockDaily, {
      skip: 0,
      take: 1,
      order: { createdAt: 'desc' },
    });

    // TODO : price가 없는 경우 0으로 리턴, 나중에 NaN과 대응되게 리턴
    if (latestResult && latestResult[0] && latestResult[0].close) {
      const currentPrice = latestResult[0].close;
      const marketCap = lstg * currentPrice;

      if (isNaN(marketCap)) return 0;
      else return marketCap;
    } else {
      return 0;
    }
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
    let low = 0;
    let high = 0;
    if (result.low && !isNaN(result.low)) low = result.low;
    if (result.high && !isNaN(result.high)) high = result.high;
    return { low, high };
  }

  private async makeStockDetailObject(
    output1: FinancialRatio,
    output2: ProductDetail,
    stockId: string,
  ): Promise<StockDetail> {
    const result = new StockDetail();
    result.stock = { id: stockId } as Stock;
    result.marketCap =
      (await this.calMarketCap(parseInt(output2.lstg_stqt))) + '';
    result.eps = parseInt(output1.eps);
    const { low, high } = await this.get52WeeksLowHigh();
    result.low52w = low;
    result.high52w = high;
    const eps = parseInt(output1.eps);
    if (isNaN(eps)) result.eps = 0;
    else result.eps = eps;
    const per = await this.calPer(eps);
    if (isNaN(per)) result.per = 0;
    else result.per = per;
    result.updatedAt = new Date();
    return result;
  }

  private async makeKospiStockObject(output: ProductDetail, stockId: string) {
    const ret = new KospiStock();
    ret.isKospi = output.kospi200_item_yn === 'Y' ? true : false;
    ret.stock = { id: stockId } as Stock;
    return ret;
  }

  private async getFinancialRatio(stock: Stock, conf: typeof openApiConfig) {
    const dataQuery = this.getDetailDataQuery(stock.id!);
    // 여기서 가져올 건 eps -> eps와 per 계산하자.
    try {
      const response = await getOpenApi(
        this.financialUrl,
        conf,
        dataQuery,
        TR_IDS.FINANCIAL_DATA,
      );
      if (response.output && response.output[0]) {
        const output1 = response.output;
        return output1[0];
      }
    } catch (error) {
      this.logger.warn(error);
    }
  }

  private async getProductData(stock: Stock, conf: typeof openApiConfig) {
    const defaultQuery = this.getFinancialDataQuery(stock.id!);

    // 여기서 가져올 건 lstg-stqt - 상장주수를 바탕으로 시가총액 계산, kospi200_item_yn 코스피200종목여부 업데이트
    try {
      const response = await getOpenApi(
        this.productUrl,
        conf,
        defaultQuery,
        TR_IDS.PRODUCTION_DETAIL,
      );
      if (response.output) {
        const output2 = response.output;
        return output2;
      }
    } catch (error) {
      this.logger.warn(error);
    }
  }

  private async getDetailDataDelay(stock: Stock, conf: typeof openApiConfig) {
    const output1 = await this.getFinancialRatio(stock, conf);
    const output2 = await this.getProductData(stock, conf);

    console.log(output1);
    console.log(output2);
    if (isFinancialRatioData(output1) && isProductDetail(output2)) {
      const stockDetail = await this.makeStockDetailObject(
        output1,
        output2,
        stock.id!,
      );
      this.saveDetailData(stockDetail);
      const kospiStock = await this.makeKospiStockObject(output2, stock.id!);
      this.saveKospiData(kospiStock);

      this.logger.info(`${stock.id!} detail data is saved`);
    }
  }

  private async getDetailDataChunk(chunk: Stock[], conf: typeof openApiConfig) {
    let delay = 0;
    for await (const stock of chunk) {
      setTimeout(() => this.getDetailDataDelay(stock, conf), delay);
      delay += this.intervals;
    }
  }

  private getFinancialDataQuery(
    stockId: string,
    code: '300' | '301' | '302' | '306' = '300',
  ): StockDetailQuery {
    return {
      pdno: stockId,
      prdt_type_cd: code,
    };
  }

  private getDetailDataQuery(
    stockId: string,
    divCode: 'J' = 'J',
    classify: '0' | '1' = '0',
  ): DetailDataQuery {
    return {
      fid_div_cls_code: classify,
      fid_cond_mrkt_div_code: divCode,
      fid_input_iscd: stockId,
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
