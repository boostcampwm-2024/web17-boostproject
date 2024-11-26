import { Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { Openapi } from '../api/openapi.abstract';
import { OpenapiTokenApi } from '../api/openapiToken.api';
import { TR_ID } from './openapiUtil.type';

export class OpenapiIndex extends Openapi {
  private readonly TR_ID: TR_ID = 'FHKST01010100';
  private readonly url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-price';
  constructor(
    @Inject('winston') private readonly logger: Logger,
    protected readonly datasource: DataSource,
    protected readonly config: OpenapiTokenApi,
  ) {
    super(datasource, config, 100);
  }

  @Cron('0 9-14 * * 1-5')
  @Cron('0-30 15 * * 1-5')
  async start() {}

  protected async interval() {}

  protected async step() {}

  protected async getFromUrl() {}

  protected async convertResToEntity() {}

  protected async save() {}

  protected query() {}
}
