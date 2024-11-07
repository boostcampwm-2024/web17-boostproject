import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { openApiConfig } from './openapi.config';

@Injectable()
export class OpenapiScraperService {
  private readonly config: typeof openApiConfig;
  public constructor() {
    this.config = openApiConfig;
    this.getToken();
  }

  private async fetchOpenApi(
    url: string,
    query: {} | undefined,
    body: {},
  ): Promise<any> {
    try {
      const response = await axios.post(url + "/oauth2/tokenP", body);
      return response.data; // 응답에서 data 부분만 추출
    } catch (error) {
      throw new Error(`Request failed: ${error}`);
    }
  }

  private async getToken() {
    const body = {
      grant_type: 'client_credentials',
      appkey: this.config.APPKEY,
      appsecret: this.config.APPSECRET,
    };
    const tmp = await this.fetchOpenApi(this.config.PROD!, undefined, body);
    console.log(tmp.access_token);
  }
}
