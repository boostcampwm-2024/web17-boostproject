import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { openApiConfig } from './config/openapi.config';
import { DataSource, EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { Cron } from '@nestjs/schedule';

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
    this.initAccessToken();
    this.initWebSocketKey();
  }

  @Cron('0 0 * * 1-5')
  private async initAccessToken() {
    this.config.forEach(async (val) => {
      val.STOCK_API_TOKEN = await this.getToken(val)!;
    });
  }

  @Cron('0 0 * * 1-5')
  private async initWebSocketKey() {
    this.config.forEach(async (val) => {
      val.STOCK_WEBSOCKET_KEY = await this.getWebSocketKey(val)!;
    });
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

  private async getItemChartPrice(config: typeof openApiConfig, query: any): Promise<any> {
    try {
      const response = await axios.get(config.STOCK_URL + '/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice', {
        params: query,
        headers: {
          'Authorization': `Bearer ${config.STOCK_API_TOKEN}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Request failed: ${error}`);
    }
  }

  private getItemChartPriceQuery(stockId: string, startDate: string, endDate: string, period: 'D' | 'W' | 'M' | 'Y', marketCode: 'J' | 'W' = 'J'): any {
    return {
      fid_cond_mrkt_div_code: marketCode,
      fid_input_iscd: stockId,
      fid_input_date_1: startDate,
      fid_input_date_2: endDate,
      fid_period_div_code: period,
      fid_org_adj_prc: 0
    };
  }
}
