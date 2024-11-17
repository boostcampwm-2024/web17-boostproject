import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { openApiConfig } from './config/openapi.config';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';

@Injectable()
export class OpenapiScraperService {
  public constructor(
    private readonly datasourse: DataSource,
    @Inject('winston') private readonly logger: Logger,
  ) {
  }

  private async getTimeItemChartPriceForEach() {}

  private async getTimeItemChartPrice(
    config: typeof openApiConfig,
    query: any,
  ): Promise<any> {
    try {
      const response = await axios.get(
        config.STOCK_URL +
          '/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice',
        {
          params: query,
          headers: {
            Authorization: `Bearer ${config.STOCK_API_TOKEN}`,
            appkey: config.STOCK_API_KEY,
            appsecret: config.STOCK_API_PASSWORD,
            tr_id: 'FHKST03010100',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Request failed: ${error}`);
    }
  }

  private getTimeItemChartPriceQuery(
    stockId: string,
    hour: string,
    marketCode: 'J' | 'W' = 'J',
  ): any {
    return {
      FID_ETC_CLS_CODE: '',
      FID_COND_MRKT_DIV_CODE: marketCode,
      FID_INPUT_ISCD: stockId,
      FID_INPUT_HOUR_1: hour,
      FID_PW_DATA_INCU_YN: 'Y',
    };
  }
}
