import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { TR_IDS } from '../type/openapiUtil.type';
import { getOpenApi } from '../util/openapiUtil.api';
import { OpenapiTokenApi } from './openapiToken.api';
import { Stock } from '@/stock/domain/stock.entity';
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';

@Injectable()
export class OpenapiLiveData {
  private readonly url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-ccnl';
  constructor(
    private readonly datasource: DataSource,
    private readonly config: OpenapiTokenApi,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async saveLiveData(data: StockLiveData[]) {
    const exists = await this.datasource.manager.exists(StockLiveData, {
      where: {
        stock: { id: data[0].stock.id },
      },
    });
    if (exists) {
      await this.datasource.manager
        .getRepository(StockLiveData)
        .createQueryBuilder()
        .update()
        .set(data[0])
        .where('stock.id = :stockId', { stockId: data[0].stock.id })
        .execute();
    } else {
      await this.datasource.manager
        .getRepository(StockLiveData)
        .createQueryBuilder()
        .insert()
        .into(StockLiveData)
        .values(data)
        .execute();
    }
  }

  convertLiveData(messages: Record<string, string>[]): StockLiveData[] {
    const stockData: StockLiveData[] = [];
    messages.map((message) => {
      const stockLiveData = new StockLiveData();
      stockLiveData.stock = { id: message.STOCK_ID } as Stock;
      stockLiveData.currentPrice = parseFloat(message.STCK_PRPR);
      stockLiveData.changeRate = parseFloat(message.PRDY_CTRT);
      stockLiveData.volume = parseInt(message.CNTG_VOL);
      stockLiveData.high = parseFloat(message.STCK_HGPR);
      stockLiveData.low = parseFloat(message.STCK_LWPR);
      stockLiveData.open = parseFloat(message.STCK_OPRC);
      stockLiveData.previousClose = parseFloat(message.WGHN_AVRG_STCK_PRC);
      stockLiveData.updatedAt = new Date();
      stockData.push(stockLiveData);
    });
    return stockData;
  }

  async connectLiveData(stockId: string) {
    const query = this.makeLiveDataQuery(stockId);

    try {
      const result = await getOpenApi(
        this.url,
        (await this.config.configs())[0],
        query,
        TR_IDS.ITEM_CHART_PRICE,
      );
      return result;
    } catch (error) {
      this.logger.warn(`Connect live data error : ${error}`);
    }
  }

  private makeLiveDataQuery(stockId: string, code: 'J' = 'J') {
    return {
      fid_cond_mrkt_div_code: code,
      fid_input_iscd: stockId,
    };
  }
}
