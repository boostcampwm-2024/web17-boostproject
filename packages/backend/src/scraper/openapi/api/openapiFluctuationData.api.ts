import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource, EntityManager } from 'typeorm';
import { Logger } from 'winston';
import {
  DECREASE_STOCK_QUERY,
  INCREASE_STOCK_QUERY,
} from '@/scraper/openapi/constants/query';
import { TR_IDS } from '@/scraper/openapi/type/openapiUtil.type';
import { FluctuationRankStock } from '@/stock/domain/FluctuationRankStock.entity';
import { Stock } from '@/stock/domain/stock.entity';
import { Json, OpenapiQueue } from '@/scraper/openapi/queue/openapi.queue';
import { OpenapiLiveData } from '@/scraper/openapi/api/openapiLiveData.api';

@Injectable()
export class OpenapiFluctuationData {
  private readonly fluctuationUrl =
    '/uapi/domestic-stock/v1/ranking/fluctuation';
  private readonly liveUrl = '/uapi/domestic-stock/v1/quotations/inquire-price';
  constructor(
    private readonly datasource: DataSource,
    private readonly openApiQueue: OpenapiQueue,
    private readonly openApiLive: OpenapiLiveData,
    @Inject('winston') private readonly logger: Logger,
  ) {
    setTimeout(() => this.getFluctuationRankStocks(), 1000);
  }

  @Cron('* 9-15 * * 1-5')
  @Cron('*/1 9-15 * * 1-5')
  async getFluctuationRankStocks() {
    await this.getFluctuationRankFromApi(true);
    await this.getFluctuationRankFromApi(false);
  }

  async getFluctuationRankFromApi(isRising: boolean) {
    const query = isRising ? INCREASE_STOCK_QUERY : DECREASE_STOCK_QUERY;
    this.openApiQueue.enqueue({
      url: this.fluctuationUrl,
      query,
      trId: TR_IDS.FLUCTUATION_DATA,
      callback: this.getFluctuationRankStocksCallback(isRising),
    });
  }

  private getFluctuationRankStocksCallback(isRising: boolean) {
    return async (data: Json) => {
      const save = this.convertToFluctuationRankStock(data, isRising);
      await this.saveFluctuationRankStocks(save, this.datasource.manager);

      save.forEach((data) => {
        const stockId = data.stock.id;
        this.insertLiveDataRequest(stockId);
      });
    };
  }

  private convertToFluctuationRankStock(data: Json, isRising: boolean) {
    if (!Array.isArray(data.output))
      return [
        {
          rank: Number(data.output.data_rank),
          fluctuationRate: data.output.prdy_ctrt,
          stock: { id: data.output.stck_shrn_iscd } as Stock,
          isRising,
        },
      ];
    return data.output.slice(0, 20).map((result: Record<string, string>) => ({
      rank: Number(result.data_rank),
      fluctuationRate: result.prdy_ctrt,
      stock: { id: result.stck_shrn_iscd } as Stock,
      isRising,
    }));
  }

  private insertLiveDataRequest(stockId: string) {
    this.openApiQueue.enqueue({
      url: this.liveUrl,
      query: {
        fid_cond_mrkt_div_code: 'J',
        fid_input_iscd: stockId,
      },
      trId: TR_IDS.LIVE_DATA,
      callback: this.openApiLive.getLiveDataSaveCallback(stockId),
    });
  }

  private async saveFluctuationRankStocks(
    result: Omit<FluctuationRankStock, 'id' | 'createdAt'>[],
    manager: EntityManager,
  ) {
    await manager
      .getRepository(FluctuationRankStock)
      .createQueryBuilder()
      .insert()
      .into(FluctuationRankStock)
      .values(result)
      .execute();
  }
}
