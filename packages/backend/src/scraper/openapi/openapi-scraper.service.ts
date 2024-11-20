import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OpenapiDetailData } from './api/openapiDetailData.api';
import { OpenapiMinuteData } from './api/openapiMinuteData.api';
import { OpenapiPeriodData } from './api/openapiPeriodData.api';
import { openApiToken } from './api/openapiToken.api';

@Injectable()
export class OpenapiScraperService {
  private readonly token = openApiToken;
  public constructor(
    private datasource: DataSource,
    private readonly openapiPeriodData: OpenapiPeriodData,
    private readonly openapiMinuteData: OpenapiMinuteData,
    private readonly openapiDetailData: OpenapiDetailData,
  ) {}
}
