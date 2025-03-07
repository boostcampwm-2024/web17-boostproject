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
    protected readonly config: OpenapiTokenApi,
  ) {
    super(datasource, config, 100);
  }

  @Cron('35 0 * * 2-6')
  async start() {
    super.start();
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

  protected query(stockId: string, code: 'J' = 'J') {
    return {
      fid_cond_mrkt_div_code: code,
      fid_input_iscd: stockId,
    };
  }

  protected async save(saveEntity: StockDetail) {
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
}
