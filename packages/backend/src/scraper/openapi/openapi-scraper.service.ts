import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { OpenapiMinuteData } from './api/openapiMinuteData.api';
import { OpenapiPeriodData } from './api/openapiPeriodData.api';

@Injectable()
export class OpenapiScraperService {
  public constructor(
    private readonly datasourse: DataSource,
    private readonly openapiPeriodData: OpenapiPeriodData,
    private readonly openapiMinuteData: OpenapiMinuteData,
    @Inject('winston') private readonly logger: Logger,
  ) {}
}
