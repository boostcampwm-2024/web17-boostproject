import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { openApiConfig } from '../config/openapi.config';
import { getOpenApi } from '../openapiUtil.api';
import {
  DetailDataQuery,
  FinancialData,
  FinancialDetail,
  isFinancialData,
  isFinancialDetail,
  isProductDetail,
  ProductDetail,
  StockDetailQuery,
} from '../type/openapiDetailData.type';
import { openApiToken } from './openapiToken.api';
import { Stock } from '@/stock/domain/stock.entity';
import { StockDetail } from '@/stock/domain/stockDetail.entity';
import { StockDaily } from '@/stock/domain/stockData.entity';

export class OpenapiDetailData {
  private readonly financialUrl: string =
    '/uapi/domestic-stock/v1/finance/financial-ratio';
  private readonly defaultUrl: string =
    '/uapi/domestic-stock/v1/quotations/search-stock-info';
  private readonly incomeUrl: string = '/uapi/domestic-stock/v1/finance/income-statement';
  private readonly intervals = 4000;
  private readonly config: (typeof openApiConfig)[] = openApiToken.configs;
  constructor(private readonly datasource: DataSource) {}

  @Cron('10 1 * * 1-5')
  public async getDetailData() {
    const entityManager = this.datasource.manager;
    const stocks = await entityManager.find(Stock);
    const configCount = this.config.length;

    const chunkSize = Math.ceil(stocks.length / configCount);

    for (let i = 0; i < configCount; i++) {
      const chunk = stocks.slice(i * chunkSize, (i + 1) * chunkSize);
      this.getDetailDataChunk(chunk, this.config[i]);
    }
  }

  private async saveDetailData(output1: FinancialData, output2: ProductDetail, output3 : StockDaily[]) {
    const entityManager = this.datasource.manager;
    const entity = StockDetail;
    entityManager.create(entity, output1);
  }

  private makeStockDetailObject(
    output1: FinancialDetail,
    output2: ProductDetail,
  ): StockDetail {
    const result = new StockDetail();
    result.marketCap = output2.
    return result;
  }

  private async getDetailDataChunk(chunk: Stock[], conf: typeof openApiConfig) {
    const manager = this.datasource.manager;
    for (const stock of chunk) {
      const dataQuery = this.getDetailDataQuery(stock.id!);
      const defaultQuery = this.getDefaultDataQuery(stock.id!);
      // 여기서 가져올 건 eps -> eps와 per 계산하자.
      const output1 = await getOpenApi(this.incomeUrl, conf, dataQuery, 'FHKST66430200');
       // 여기서 가져올 건 lstg-stqt - 상장주수를 바탕으로 시가총액 계산, kospi200_item_yn 코스피200종목여부 업데이트
      const output2 = await getOpenApi(
        this.defaultUrl,
        conf,
        defaultQuery,
        'CTPF1002R',
      );
      // 주식의 52주간 일단위 데이터 전체 중에 최고, 최저가를 바탕으로 최저가, 최고가 계산해서 가져오기
      const output3 = await manager.find(StockDaily, {
        select: {
          
        },
        where: {

        }
      })
      // 주식 마지막 데이터 끌고 오기. 최신 데이터로.
      if ( isProductDetail(output1)) {
      }
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
