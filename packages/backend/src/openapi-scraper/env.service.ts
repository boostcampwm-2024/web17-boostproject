import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvService {
  public constructor(private configService: ConfigService) {}

  private getKeyValue(key: string): { key: string; value: string } {
    return { key: key, value: this.configService.get<string>(key) };
  }

  public getOpenApiUrl() {
    return this.getKeyValue("PROD");
  }

  public getAppKey() {
    return this.getKeyValue("PROD_APPKEY");
  }

  public getAppSecret() {
    return this.getKeyValue("PROD_APPSECRET");
  }
}
