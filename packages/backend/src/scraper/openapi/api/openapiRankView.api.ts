import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { OpenapiLiveData } from '@/scraper/openapi/api/openapiLiveData.api';
import { OpenapiQueue } from '@/scraper/openapi/queue/openapi.queue';
import { TR_IDS } from '@/scraper/openapi/type/openapiUtil.type';
import { Stock } from '@/stock/domain/stock.entity';

@Injectable()
export class OpenapiRankViewApi {
  private readonly liveUrl = '/uapi/domestic-stock/v1/quotations/inquire-price';

  constructor(
    private readonly datasource: DataSource,
    private readonly openApiLiveData: OpenapiLiveData,
    private readonly openApiQueue: OpenapiQueue,
  ) {
    setTimeout(() => this.getTopViewsStockLiveData(), 6000);
  }

  @Cron('* 9-15 * * 1-5')
  async getTopViewsStockLiveData() {
    const date = await this.findTopViewsStocks();
    date.forEach((stock) => {
      this.openApiQueue.enqueue({
        url: this.liveUrl,
        query: {
          fid_cond_mrkt_div_code: 'J',
          fid_input_iscd: stock.id,
        },
        trId: TR_IDS.LIVE_DATA,
        callback: this.openApiLiveData.getLiveDataSaveCallback(stock.id),
      });
    });
  }

  private async findTopViewsStocks() {
    return await this.datasource.manager
      .getRepository(Stock)
      .createQueryBuilder('stock')
      .orderBy('stock.views', 'DESC')
      .limit(10)
      .getMany();
  }
}
