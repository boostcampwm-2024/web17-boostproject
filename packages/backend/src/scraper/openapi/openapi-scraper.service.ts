import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OpenapiDetailData } from './api/openapiDetailData.api';
import { OpenapiMinuteData } from './api/openapiMinuteData.api';
import { OpenapiPeriodData } from './api/openapiPeriodData.api';

@Injectable()
export class OpenapiScraperService {
  public constructor(
    private datasource: DataSource,
    private readonly openapiPeriodData: OpenapiPeriodData,
    private readonly openapiMinuteData: OpenapiMinuteData,
    private readonly openapiDetailData: OpenapiDetailData,
  ) {}
}
