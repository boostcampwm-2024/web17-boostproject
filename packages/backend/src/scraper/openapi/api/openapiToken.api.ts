import { openApiConfig } from '../config/openapi.config';
import { Logger } from 'winston';
import { Inject, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';
import { logger } from '@/configs/logger.config';

class OpenapiTokenApi {
  private config: (typeof openApiConfig)[] = [];
  public constructor(@Inject('winston') private readonly logger: Logger) {
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
    this.initAuthenValue();
  }

  public get configs() {
    return this.config;
  }

  private async initAuthenValue() {
    await this.initAccessToken();
    await this.initWebSocketKey();
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
  }

  @Cron('30 0 * * 1-5')
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
}

const openApiToken = new OpenapiTokenApi(logger);
export { openApiToken };
