import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { openApiConfig } from '../config/openapi.config';
import { isOpenapiLiveData } from '../type/openapiLiveData.type';
import { TR_IDS } from '../type/openapiUtil.type';
import { getOpenApi } from '../util/openapiUtil.api';
import { Stock } from '@/stock/domain/stock.entity';
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';

@Injectable()
export class OpenapiLiveData {
  private readonly url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-ccnl';
  constructor(
    private readonly datasource: DataSource,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async saveLiveData(data: StockLiveData[]) {
    await this.datasource.manager
      .getRepository(StockLiveData)
      .createQueryBuilder()
      .insert()
      .values(data[0])
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

  // 현재가 체결
  convertResponseToStockLiveData = (
    data: OpenapiLiveData,
    stockId: string,
  ): StockLiveData | undefined => {
    const stockLiveData = new StockLiveData();
    if (isOpenapiLiveData(data)) {
      stockLiveData.stock = { id: stockId } as Stock;
      stockLiveData.currentPrice = parseFloat(data.stck_prpr);
      stockLiveData.changeRate = parseFloat(data.prdy_ctrt);
      stockLiveData.volume = parseInt(data.acml_vol);
      stockLiveData.high = parseFloat(data.stck_hgpr);
      stockLiveData.low = parseFloat(data.stck_lwpr);
      stockLiveData.open = parseFloat(data.stck_oprc);
      stockLiveData.updatedAt = new Date();

      return stockLiveData;
    }
  };

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
      stockLiveData.updatedAt = new Date();

      stockData.push(stockLiveData);
    });
    return stockData;
  }

  async connectLiveData(stockId: string, config: typeof openApiConfig) {
    const query = this.makeLiveDataQuery(stockId);

    try {
      const result = await getOpenApi(
        this.url,
        config,
        query,
        TR_IDS.LIVE_DATA,
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
