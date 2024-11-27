import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource, EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { OpenapiTokenApi } from '@/scraper/openapi/api/openapiToken.api';
import { TR_IDS } from '@/scraper/openapi/type/openapiUtil.type';
import { getOpenApi } from '@/scraper/openapi/util/openapiUtil.api';
import { FluctuationRankStock } from '@/stock/domain/FluctuationRankStock.entity';
import { Stock } from '@/stock/domain/stock.entity';
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';

@Injectable()
export class OpenapiRankViewApi {
  private readonly liveUrl = '/uapi/domestic-stock/v1/quotations/inquire-price';
  constructor(
    private readonly datasource: DataSource,
    private readonly openApiToken: OpenapiTokenApi,
    @Inject('winston') private readonly logger: Logger,
  ) {
    setTimeout(() => this.getTopViewsStockLiveData(), 1000);
  }

  @Cron('* 9-15 * * 1-5')
  async getTopViewsStockLiveData(count = 5) {
    try {
      if (count === 0) return;
      const topViewsStocks = await this.getTopViewsStocks();
      const liveResult = await this.getFluctuationRankApiLive(topViewsStocks);
      await this.datasource.transaction(async (manager) => {
        await this.datasource.manager.delete(FluctuationRankStock, {
          isRising: false,
        });
        await this.saveLiveData(liveResult, manager);
        this.logger.info('decrease rank stocks updated');
      });
    } catch (error) {
      this.logger.warn(error);
      this.getTopViewsStockLiveData(--count);
    }
  }

  private async getTopViewsStocks() {
    return await this.datasource.manager
      .getRepository(Stock)
      .createQueryBuilder('stock')
      .orderBy('stock.views', 'DESC')
      .limit(10)
      .getMany();
  }

  private async getFluctuationRankApiLive(data: Stock[]) {
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
