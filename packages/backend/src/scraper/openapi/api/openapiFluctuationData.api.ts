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
import { Stock } from '@/stock/domain/stock.entity';
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';
import { Json, OpenapiQueue } from '@/scraper/openapi/queue/openapi.queue';

@Injectable()
export class OpenapiFluctuationData {
  private readonly fluctuationUrl =
    '/uapi/domestic-stock/v1/ranking/fluctuation';
  private readonly liveUrl = '/uapi/domestic-stock/v1/quotations/inquire-price';
  constructor(
    private readonly openApiToken: OpenapiTokenApi,
    private readonly datasource: DataSource,
    private readonly openApiQueue: OpenapiQueue,
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

  async getDecreaseRankStocks(count = 5) {
    try {
      if (count === 0) return;
      const result = await this.getFluctuationRankApiStocks(false);
      const liveResult = await this.getFluctuationRankApiLive(result);
      await this.datasource.transaction(async (manager) => {
        await this.datasource.manager.delete(FluctuationRankStock, {
          isRising: false,
        });
        await this.saveFluctuationRankStocks(result, manager);
        await this.saveLiveData(liveResult, manager);
        this.logger.info('decrease rank stocks updated');
      });
    } catch (error) {
      this.logger.warn(error);
      await new Promise((resolve) =>
        setTimeout(() => resolve(this.getDecreaseRankStocks(--count)), 2000),
      );
    }
  }

  async getIncreaseRankStocks(count = 5) {
    try {
      if (count === 0) return;
      const result = await this.getFluctuationRankApiStocks(true);
      const liveResult = await this.getFluctuationRankApiLive(result);
      await this.datasource.transaction(async (manager) => {
        await this.datasource.manager.delete(FluctuationRankStock, {
          isRising: true,
        });
        await this.saveFluctuationRankStocks(result, manager);
        await this.saveLiveData(liveResult, manager);
        this.logger.info('increase rank stocks updated');
      });
    } catch (error) {
      this.logger.warn(error);
      await new Promise((resolve) =>
        setTimeout(() => resolve(this.getIncreaseRankStocks(--count)), 3000),
      );
    }
  }

  private async getFluctuationRankFromApi(isRising: boolean) {
    const query = isRising ? INCREASE_STOCK_QUERY : DECREASE_STOCK_QUERY;
    const callback: <T extends Json>(value: T) => Promise<void> = async (
      data: Json,
    ) => {
      if (!Array.isArray(data.output)) return;
      const save = data.output
        .slice(0, 20)
        .map((result: Record<string, string>) => ({
          rank: Number(result.data_rank),
          fluctuationRate: result.prdy_ctrt,
          stock: { id: result.stck_shrn_iscd } as Stock,
          isRising,
        }));
      await this.saveFluctuationRankStocks(save, this.datasource.manager);

      save.forEach((data) => {
        const stockId = data.stock.id;
        const callback: <T extends Json>(value: T) => Promise<void> = async (
          data: Json,
        ) => {
          if (Array.isArray(data.output)) return;
          const stockLiveData = this.convertToStockLiveData(
            data.output,
            stockId,
          );
          await this.saveIndividualLiveData(
            stockLiveData,
            this.datasource.manager,
          );
        };
        this.openApiQueue.enqueue({
          url: this.liveUrl,
          query: {
            fid_cond_mrkt_div_code: 'J',
            fid_input_iscd: stockId,
          },
          trId: TR_IDS.LIVE_DATA,
          callback,
        });
      });
    };

    this.openApiQueue.enqueue({
      url: this.fluctuationUrl,
      query,
      trId: TR_IDS.FLUCTUATION_DATA,
      callback,
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

  private async saveLiveData(data: StockLiveData[], manager: EntityManager) {
    return await manager
      .getRepository(StockLiveData)
      .createQueryBuilder()
      .insert()
      .into(StockLiveData)
      .values(data)
      .orUpdate(
        ['current_price', 'change_rate', 'volume', 'high', 'low', 'open'],
        ['stock_id'],
      )
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

    return result.output.slice(0, 20).map((result: Record<string, string>) => {
      return {
        rank: result.data_rank,
        fluctuationRate: result.prdy_ctrt,
        stock: { id: result.stck_shrn_iscd },
        isRising,
      };
    });
  }

  private async getFluctuationRankApiLive(data: FluctuationRankStock[]) {
    const result: StockLiveData[] = [];
    for (let i = 0; i < 20; ++i) {
      if (i >= data.length) break;
      else if (i == 10)
        await new Promise((resolve) => setTimeout(resolve, 1500));
      const stockId = data[i].stock.id;
      const stockData = await getOpenApi(
        this.liveUrl,
        (await this.openApiToken.configs())[0],
        {
          fid_cond_mrkt_div_code: 'J',
          fid_input_iscd: stockId,
        },
        TR_IDS.LIVE_DATA,
      );
      result.push(this.convertToStockLiveData(stockData.output, stockId));
    }
    return result;
  }

  private convertToStockLiveData(
    stockData: Record<string, string>,
    stockId: string,
  ): StockLiveData {
    const stockLiveData = new StockLiveData();
    stockLiveData.stock = { id: stockId } as Stock;
    stockLiveData.currentPrice = parseFloat(stockData.stck_prpr);
    stockLiveData.changeRate = parseFloat(stockData.prdy_ctrt);
    stockLiveData.volume = parseInt(stockData.acml_vol);
    stockLiveData.high = parseFloat(stockData.stck_hgpr);
    stockLiveData.low = parseFloat(stockData.stck_lwpr);
    stockLiveData.open = parseFloat(stockData.stck_oprc);
    stockLiveData.updatedAt = new Date();
    return stockLiveData;
  }

  private async saveIndividualLiveData(
    data: StockLiveData,
    manager: EntityManager,
  ) {
    return await manager
      .getRepository(StockLiveData)
      .createQueryBuilder()
      .insert()
      .into(StockLiveData)
      .values(data)
      .orUpdate(
        [
          'current_price',
          'change_rate',
          'volume',
          'high',
          'low',
          'open',
          'updatedAt',
        ],
        ['stock_id'],
      )
      .execute();
  }
}
