import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OpenapiDetailData } from './api/openapiDetailData.api';
import { OpenapiMinuteData } from './api/openapiMinuteData.api';
import { OpenapiPeriodData } from './api/openapiPeriodData.api';

@Injectable()
export class OpenapiScraperService {
  private readonly openapiPeriodData: OpenapiPeriodData;
  private readonly openapiMinuteData: OpenapiMinuteData;
  private readonly openapiDetailData: OpenapiDetailData;
  public constructor(private datasource: DataSource) {
    if (process.env.NODE_ENV === 'production') {
      this.openapiPeriodData = new OpenapiPeriodData(datasource);
      this.openapiMinuteData = new OpenapiMinuteData(datasource);
      this.openapiDetailData = new OpenapiDetailData(datasource);
    }
  }
}
