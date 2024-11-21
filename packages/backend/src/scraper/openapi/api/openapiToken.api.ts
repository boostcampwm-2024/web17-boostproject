import { Inject, UseFilters } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Logger } from 'winston';
import { openApiConfig } from '../config/openapi.config';
import { OpenapiExceptionFilter } from '../Decorator/openapiException.filter';
import { OpenapiException } from '../util/openapiCustom.error';
import { postOpenApi } from '../util/openapiUtil.api';
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

  @UseFilters(OpenapiExceptionFilter)
  private async initAuthenValue() {
    const delay = 60000;
    const delayMinute = delay / 1000 / 60;

    try {
      await this.initAccessToken();
      await this.initWebSocketKey();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.warn(
          `Request failed: ${error.message}. Retrying in ${delayMinute} minute...`,
        );
      } else {
        this.logger.warn(
          `Request failed. Retrying in ${delayMinute} minute...`,
        );
        setTimeout(async () => {
          await this.initAccessToken();
          await this.initWebSocketKey();
        }, delay);
      }
    }
  }

  @Cron('50 0 * * 1-5')
  private async initAccessToken() {
    const updatedConfig = await Promise.all(
      this.config.map(async (val) => {
        val.STOCK_API_TOKEN = await this.getToken(val)!;
        return val;
      }),
    );
    this.config = updatedConfig;
  }

  @Cron('50 0 * * 1-5')
  private async initWebSocketKey() {
    this.config.forEach(async (val) => {
      val.STOCK_WEBSOCKET_KEY = await this.getWebSocketKey(val)!;
    });
  }

  private async getToken(config: typeof openApiConfig): Promise<string> {
    const body = {
      grant_type: 'client_credentials',
      appkey: config.STOCK_API_KEY,
      appsecret: config.STOCK_API_PASSWORD,
    };
    const tmp = await postOpenApi('/oauth2/tokenP', config, body);
    if (!tmp.access_token) {
      throw new OpenapiException('Access Token Failed', 403);
    }
    return tmp.access_token as string;
  }

  private async getWebSocketKey(config: typeof openApiConfig): Promise<string> {
    const body = {
      grant_type: 'client_credentials',
      appkey: config.STOCK_API_KEY,
      secretkey: config.STOCK_API_PASSWORD,
    };
    const tmp = await postOpenApi('/oauth2/Approval', config, body);
    if (!tmp.approval_key) {
      throw new OpenapiException('WebSocket Key Failed', 403);
    }
    return tmp.approval_key as string;
  }
}

const openApiToken = new OpenapiTokenApi(logger);
export { openApiToken };
