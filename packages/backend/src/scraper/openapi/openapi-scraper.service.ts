import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { openApiConfig } from './config/openapi.config';
import { DataSource, EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { Cron } from '@nestjs/schedule';
import { Stock } from '@/stock/domain/stock.entity';
import { StockPeriod } from '@/stock/domain/stockPeriod';
import { StockDaily } from '@/stock/domain/stockDaily.entity';
import { exists } from 'fs';

type ChartData = {
  stck_bsop_date: string;
  stck_clpr: string;
  stck_oprc: string;
  stck_hgpr: string;
  stck_lwpr: string;
  acml_vol: string;
  acml_tr_pbmn: string;
  flng_cls_code: string;
  prtt_rate: string;
  mod_yn: string;
  prdy_vrss_sign: string;
  prdy_vrss: string;
  revl_issu_reas: string;
};

@Injectable()
export class OpenapiScraperService {
  private config: (typeof openApiConfig)[] = [];
  public constructor(
    private readonly datasourse: DataSource,
    @Inject('winston') private readonly logger: Logger,
  ) {
    const accounts = openApiConfig.STOCK_ACCOUNT!.split(',');
    const api_keys = openApiConfig.STOCK_API_KEY!.split(',');
    const api_passwords = openApiConfig.STOCK_API_PASSWORD!.split(',');
    if (
      accounts.length === 0 ||
      accounts.length !== api_keys.length ||
      api_passwords.length !== api_keys.length
    ) {
      this.logger.warn('Open API Config Error');
    }
    for (let i = 0; i < accounts.length; i++) {
      this.config.push({
        STOCK_URL: openApiConfig.STOCK_URL,
        STOCK_ACCOUNT: accounts[i],
        STOCK_API_KEY: api_keys[i],
        STOCK_API_PASSWORD: api_passwords[i],
      });
    }

    //if (process.env.NODE_ENV === 'production') {
    //  this.initAccessToken();
    //  this.initWebSocketKey();
    //  this.getItemChartPriceCheck();
    //}
    this.initAuthenValue();
  }

  private async initAuthenValue() {
    await this.initAccessToken();
    await this.initWebSocketKey();
    this.getItemChartPriceCheck();
  }

  @Cron('30 0 * * 1-5')
  private async initAccessToken() {
    const updatedConfig = await Promise.all(
      this.config.map(async (val) => {
        val.STOCK_API_TOKEN = await this.getToken(val)!;
        return val;
      }),
    );
    this.config = updatedConfig;
    console.log(updatedConfig);
  }

  @Cron('30 0 * * 1-5')
  private async initWebSocketKey() {
    this.config.forEach(async (val) => {
      val.STOCK_WEBSOCKET_KEY = await this.getWebSocketKey(val)!;
    });
  }

  @Cron('0 1 * * 1-5')
  private async getItemChartPriceCheck() {
    const entityManager = this.datasourse.manager;
    const stocks = await entityManager.find(Stock);
    const configCount = this.config.length;
    const chunkSize = Math.ceil(stocks.length / configCount);

    for (let i = 0; i < configCount; i++) {
      const chunk = stocks.slice(i * chunkSize, (i + 1) * chunkSize);
      const config = this.config[i];

      for await (const stock of chunk) {
        let endDate = this.getTodayDate();
        let startDate = this.getPreviousDate(endDate, 3);
        let hasData = true;

        while (hasData) {
          const query = this.getItemChartPriceQuery(
            stock.id!,
            startDate,
            endDate,
            'D',
          );
          const data = await this.getItemChartPrice(config, query);

          if (data && data.output2 && data.output2.length > 0) {
            await this.saveChartData(StockDaily, stock.id!, data.output2);
            endDate = this.getPreviousDate(startDate, 3);
            startDate = this.getPreviousDate(endDate, 3);
          } else {
            hasData = false;
          }
        }
      }
    }
  }

  private async postOpenApi(url: string, body: {}): Promise<any> {
    try {
      const response = await axios.post(url, body);
      return response.data;
    } catch (error) {
      throw new Error(`Request failed: ${error}`);
    }
  }

  private async getToken(config: typeof openApiConfig): Promise<string> {
    const body = {
      grant_type: 'client_credentials',
      appkey: config.STOCK_API_KEY,
      appsecret: config.STOCK_API_PASSWORD,
    };
    const tmp = await this.postOpenApi(
      config.STOCK_URL + '/oauth2/tokenP',
      body,
    );
    if (!tmp.access_token) {
      throw new NotFoundException('Access Token Failed');
    }
    return tmp.access_token as string;
  }

  private async getWebSocketKey(config: typeof openApiConfig): Promise<string> {
    const body = {
      grant_type: 'client_credentials',
      appkey: config.STOCK_API_KEY,
      secretkey: config.STOCK_API_PASSWORD,
    };
    const tmp = await this.postOpenApi(
      config.STOCK_URL + '/oauth2/Approval',
      body,
    );
    if (!tmp.approval_key) {
      throw new NotFoundException('WebSocket Key Failed');
    }
    return tmp.approval_key as string;
  }

  private getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0].replace(/-/g, '');
  }

  private getPreviousDate(date: string, months: number): string {
    const currentDate = new Date(
      date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8),
    );
    currentDate.setMonth(currentDate.getMonth() - months);
    return currentDate.toISOString().split('T')[0].replace(/-/g, '');
  }

  private async existsChartData(
    stock: StockPeriod,
    manager: EntityManager,
    entity: typeof StockPeriod,
  ) {
    return await manager.findOne(entity, {
      where: {
        stock: { id: stock.stock.id },
        start_time: stock.start_time,
      },
    });
  }

  private async insertChartData(
    stock: StockPeriod,
    entity: typeof StockPeriod,
  ) {
    const manager = this.datasourse.manager;
    if (!(await this.existsChartData(stock, manager, entity))) {
      await manager.save(entity, stock);
    }
  }

  private async saveChartData(
    entity: typeof StockPeriod,
    stockId: string,
    data: ChartData[],
  ) {
    for (const item of data) {
      const stockPeriod = new StockPeriod();
      stockPeriod.stock = { id: stockId } as Stock;
      stockPeriod.start_time = new Date(item.stck_bsop_date);
      stockPeriod.close = parseInt(item.stck_clpr);
      stockPeriod.open = parseInt(item.stck_oprc);
      stockPeriod.high = parseInt(item.stck_hgpr);
      stockPeriod.low = parseInt(item.stck_lwpr);
      stockPeriod.volume = parseInt(item.acml_vol, 10);
      stockPeriod.created_at = new Date();
      await this.insertChartData(stockPeriod, entity);
    }
  }

  private async getItemChartPrice(
    config: typeof openApiConfig,
    query: any,
  ): Promise<any> {
    try {
      console.log;
      const response = await axios.get(
        config.STOCK_URL +
          '/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice',
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

  private getItemChartPriceQuery(
    stockId: string,
    startDate: string,
    endDate: string,
    period: 'D' | 'W' | 'M' | 'Y',
    marketCode: 'J' | 'W' = 'J',
  ): any {
    return {
      fid_cond_mrkt_div_code: marketCode,
      fid_input_iscd: stockId,
      fid_input_date_1: startDate,
      fid_input_date_2: endDate,
      fid_period_div_code: period,
      fid_org_adj_prc: 0,
    };
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
