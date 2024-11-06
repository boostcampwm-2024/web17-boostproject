import { Injectable } from "@nestjs/common";
import { EnvService } from "./env.service";

@Injectable()
export class OpenapiScraperService {
  private token: string;
  public constructor(private env: EnvService) {}

  private async fetchOpenApiSpec(url: string): Promise<any> {}

  private getToken() {}
}
