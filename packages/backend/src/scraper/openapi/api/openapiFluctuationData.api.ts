import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource, EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { OpenapiTokenApi } from '@/scraper/openapi/api/openapiToken.api';
import {
  DECREASE_STOCK_QUERY,
  INCREASE_STOCK_QUERY,
} from '@/scraper/openapi/constants/query';
import { TR_IDS } from '@/scraper/openapi/type/openapiUtil.type';
import { getOpenApi } from '@/scraper/openapi/util/openapiUtil.api';
import { FluctuationRankStock } from '@/stock/domain/FluctuationRankStock.entity';

@Injectable()
export class OpenapiFluctuationData {
  private readonly fluctuationUrl: string =
    '/uapi/domestic-stock/v1/ranking/fluctuation';
  constructor(
    private readonly openApiToken: OpenapiTokenApi,
    private readonly datasource: DataSource,
    @Inject('winston') private readonly logger: Logger,
  ) {
    setTimeout(() => this.getFluctuationRankStocks(), 1000);
  }

  @Cron('*/1 9-16 * * 1-5')
  async getFluctuationRankStocks() {
    await this.getDecreaseRankStocks();
    await this.getIncreaseRankStocks();
  }

  async getDecreaseRankStocks(count = 5) {
    try {
      if (count === 0) return;
      await this.datasource.transaction(async (manager) => {
        const result = await this.getFluctuationRankApiStocks(false);
        await this.datasource.manager.delete(FluctuationRankStock, {
          isRising: false,
        });
        await this.saveFluctuationRankStocks(result, manager);
        this.logger.info('decrease rank stocks updated');
      });
    } catch (error) {
      this.logger.warn(error);
      this.getDecreaseRankStocks(--count);
    }
  }

  async getIncreaseRankStocks(count = 5) {
    try {
      if (count === 0) return;
      await this.datasource.transaction(async (manager) => {
        const result = await this.getFluctuationRankApiStocks(true);
        await this.datasource.manager.delete(FluctuationRankStock, {
          isRising: true,
        });
        await this.saveFluctuationRankStocks(result, manager);
        this.logger.info('increase rank stocks updated');
      });
    } catch (error) {
      this.logger.warn(error);
      this.getIncreaseRankStocks(--count);
    }
  }

  private async saveFluctuationRankStocks(
    result: FluctuationRankStock[],
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

  private async getFluctuationRankApiStocks(isRising: boolean) {
    const query = isRising ? INCREASE_STOCK_QUERY : DECREASE_STOCK_QUERY;
    const result = await getOpenApi(
      this.fluctuationUrl,
      (await this.openApiToken.configs())[0],
      query,
      TR_IDS.FLUCTUATION_DATA,
    );

    return result.output.map((result: Record<string, string>) => ({
      rank: result.data_rank,
      fluctuationRate: result.prdy_ctrt,
      stock: { id: result.stck_shrn_iscd },
      isRising,
    }));
  }
}
