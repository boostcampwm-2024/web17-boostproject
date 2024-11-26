import { Global, Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { OpenapiToken } from '../../domain/openapiToken.entity';
import { openApiConfig } from '../config/openapi.config';
import { OpenapiException } from '../util/openapiCustom.error';
import { postOpenApi } from '../util/openapiUtil.api';

@Global()
@Injectable()
export class OpenapiTokenApi {
  private config: (typeof openApiConfig)[] = [];
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly datasource: DataSource,
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
  }

  async configs() {
    this.logger.info('config called');
    await this.init();
    return this.config;
  }

  @Cron('30 0 * * 1-5')
  async init() {
    const tokens = this.convertConfigToTokenEntity(this.config);
    const config = await this.getPropertyFromDB(tokens);
    const expired = config.filter(
      (val) =>
        this.isTokenExpired(val.api_token_expire) &&
        this.isTokenExpired(val.websocket_key_expire),
    );

    if (expired.length || !config.length) {
      await this.initAuthenValue();
      const newTokens = this.convertConfigToTokenEntity(this.config);
      await this.savePropertyToDB(newTokens);
    } else {
      this.config = this.convertTokenEntityToConfig(config);
    }
  }

  private isTokenExpired(startDate?: Date) {
    if (!startDate) return true;
    const now = new Date();
    //실제 만료 시간은 24시간이지만, 문제가 발생할 여지를 줄이기 위해 20시간으로 설정
    const baseTimeToMilliSec = 20 * 60 * 60 * 1000;
    const timeDiff = now.getTime() - startDate.getTime();

    return timeDiff >= baseTimeToMilliSec;
  }

  private convertTokenEntityToConfig(tokens: OpenapiToken[]) {
    const result: (typeof openApiConfig)[] = [];
    tokens.forEach((val) => {
      const config: typeof openApiConfig = {
        STOCK_ACCOUNT: val.account,
        STOCK_API_KEY: val.api_key,
        STOCK_API_PASSWORD: val.api_password,
        STOCK_API_TOKEN: val.api_token,
        STOCK_URL: val.api_url,
        STOCK_WEBSOCKET_KEY: val.websocket_key,
      };
      result.push(config);
    });
    return result;
  }

  private convertConfigToTokenEntity(config: (typeof openApiConfig)[]) {
    const result: OpenapiToken[] = [];
    config.forEach((val) => {
      const token = new OpenapiToken();
      if (
        val.STOCK_URL &&
        val.STOCK_ACCOUNT &&
        val.STOCK_API_KEY &&
        val.STOCK_API_PASSWORD
      ) {
        token.api_url = val.STOCK_URL;
        token.account = val.STOCK_ACCOUNT;
        token.api_key = val.STOCK_API_KEY;
        token.api_password = val.STOCK_API_PASSWORD;
      }
      token.api_token = val.STOCK_API_TOKEN;
      token.websocket_key = val.STOCK_WEBSOCKET_KEY;
      token.api_token_expire = new Date();
      token.websocket_key_expire = new Date();
      result.push(token);
    });
    return result;
  }

  private async savePropertyToDB(tokens: OpenapiToken[]) {
    tokens.forEach(async (val) => {
      this.datasource.manager.save(OpenapiToken, val);
    });
  }

  private async getPropertyFromDB(tokens: OpenapiToken[]) {
    const result: OpenapiToken[] = [];
    await Promise.all(
      tokens.map(async (val) => {
        const findByToken = await this.datasource.manager.findOne(
          OpenapiToken,
          {
            where: {
              account: val.account,
              api_key: val.api_key,
              api_password: val.api_password,
            },
          },
        );
        if (findByToken) {
          result.push(findByToken);
        }
      }),
    );
    return result;
  }

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

  private async initAccessToken() {
    const updatedConfig = await Promise.all(
      this.config.map(async (val) => {
        val.STOCK_API_TOKEN = await this.getToken(val)!;
        return val;
      }),
    );
    this.config = updatedConfig;
    this.logger.info(`Init access token : ${this.config}`);
  }

  private async initWebSocketKey() {
    const updatedConfig = await Promise.all(
      this.config.map(async (val) => {
        val.STOCK_WEBSOCKET_KEY = await this.getWebSocketKey(val)!;
        return val;
      }),
    );
    this.config = updatedConfig;
    this.logger.info(`Init websocket token : ${this.config}`);
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
