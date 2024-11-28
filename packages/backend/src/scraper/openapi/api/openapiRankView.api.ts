import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource, EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { OpenapiTokenApi } from '@/scraper/openapi/api/openapiToken.api';
import { Json, OpenapiQueue } from '@/scraper/openapi/queue/openapi.queue';
import { TR_IDS } from '@/scraper/openapi/type/openapiUtil.type';
import { getOpenApi } from '@/scraper/openapi/util/openapiUtil.api';
import { Stock } from '@/stock/domain/stock.entity';
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';

@Injectable()
export class OpenapiRankViewApi {
  private readonly liveUrl = '/uapi/domestic-stock/v1/quotations/inquire-price';

  constructor(
    private readonly datasource: DataSource,
    private readonly openApiToken: OpenapiTokenApi,
    private readonly openApiQueue: OpenapiQueue,
    @Inject('winston') private readonly logger: Logger,
  ) {
    setTimeout(() => this.getTopViewsStockLiveData(), 6000);
  }

  @Cron('* 9-15 * * 1-5')
  async getTopViewsStockLiveData(count = 5) {
    try {
      if (count === 0) return;
      await this.getTopViewsStocks();
      // const liveResult = await this.getFluctuationRankApiLive(topViewsStocks);
    } catch (error) {
      this.logger.warn(error);
      this.getTopViewsStockLiveData(--count);
    }
  }

  private async getTopViewsStocks() {
    const date = await this.datasource.manager
      .getRepository(Stock)
      .createQueryBuilder('stock')
      .orderBy('stock.views', 'DESC')
      .limit(10)
      .getMany();
    date.forEach((stock) => {
      const callback: <T extends Json>(value: T) => Promise<void> = async (
        liveResult: Json,
      ) => {
        const data = this.convertToStockLiveData(liveResult.output, stock.id);
        await this.saveIndividualLiveData(data, this.datasource.manager);
      };
      this.openApiQueue.enqueue({
        url: this.liveUrl,
        query: {
          fid_cond_mrkt_div_code: 'J',
          fid_input_iscd: stock.id,
        },
        trId: TR_IDS.LIVE_DATA,
        callback,
      });
    });
    return date.slice(0, 10);
  }

  private async getViewsRankApiLive(data: Stock[]) {
    const result: StockLiveData[] = [];
    for (let i = 0; i < 20; ++i) {
      if (i >= data.length) break;
      else if (i == 10)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      const stockId = data[i].id;
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
        ['current_price', 'change_rate', 'volume', 'high', 'low', 'open'],
        ['stock_id'],
      )
      .execute();
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
}
