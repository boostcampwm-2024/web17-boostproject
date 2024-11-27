import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { openApiConfig } from '../config/openapi.config';
import { DetailData, isDetailData } from '../type/openapiDetailData.type';
import { TR_ID } from '../type/openapiUtil.type';
import { getOpenApi } from '../util/openapiUtil.api';
import { Openapi } from './openapi.abstract';
import { OpenapiTokenApi } from './openapiToken.api';
import { Stock } from '@/stock/domain/stock.entity';
import { StockDetail } from '@/stock/domain/stockDetail.entity';

@Injectable()
export class OpenapiDetailData extends Openapi {
  private readonly TR_ID: TR_ID = 'FHKST01010100';
  private readonly url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-price';
  constructor(
    @Inject('winston') private readonly logger: Logger,
    protected readonly datasource: DataSource,
    private readonly config: OpenapiTokenApi,
  ) {
    super(datasource);
  }

  @Cron('35 0 * * 1-5')
  async start() {
    const stock = await this.getStockId();
    const len = (await this.config.configs()).length;
    const stockSize = Math.ceil(stock.length / len);
    let i = 0;
    while (i < len) {
      this.interval(i, stock.slice(i * stockSize, (i + 1) * stockSize));
      i++;
    }
  }

  protected async interval(idx: number, stocks: Stock[]) {
    const interval = 100;
    let time = 0;
    for (const stock of stocks) {
      setTimeout(() => this.step(idx, stock), time);
      time += interval;
    }
  }

  protected async step(idx: number, stock: Stock) {
    try {
      const config = (await this.config.configs())[idx];
      const res = await this.getFromUrl(config, stock.id);
      if (res.output && isDetailData(res.output)) {
        const entity = this.convertResToEntity(res.output, stock.id);
        await this.save(entity);
      }
    } catch (error) {
      this.logger.warn(`Error in detail data : ${error}`);
      setTimeout(() => this.step(idx, stock), 100);
    }
  }

  protected async getFromUrl(config: typeof openApiConfig, stockId: string) {
    const query = this.query(stockId);
    const res = await getOpenApi(this.url, config, query, this.TR_ID);
    if (res) return res;
    else throw new Error();
  }

  protected convertResToEntity(res: DetailData, stockId: string): StockDetail {
    const result = new StockDetail();
    result.eps = parseInt(res.eps);
    result.high52w = parseInt(res.w52_hgpr);
    result.low52w = parseInt(res.w52_lwpr);
    result.marketCap = res.hts_avls;
    result.per = parseFloat(res.per);
    result.stock = { id: stockId } as Stock;
    result.updatedAt = new Date();
    return result;
  }

  //private async getStockId() {
  //  const entity = Stock;
  //  const manager = this.datasource.manager;
  //  const result = await manager.find(entity, {
  //    select: { id: true },
  //    where: { isTrading: true },
  //  });
  //  return result;
  //}

  private async save(saveEntity: StockDetail) {
    const entity = StockDetail;
    const manager = this.datasource.manager;
    await manager
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(saveEntity)
      .orUpdate(
        ['market_cap', 'eps', 'per', 'high52w', 'low52w', 'updated_at'],
        ['stock_id'],
      )
      .execute();
  }

  protected query(stockId: string, code: 'J' = 'J') {
    return {
      fid_cond_mrkt_div_code: code,
      fid_input_iscd: stockId,
    };
  }
}
