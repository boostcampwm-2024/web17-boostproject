import { Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { Openapi } from '../api/openapi.abstract';
import { OpenapiTokenApi } from '../api/openapiToken.api';
import { TR_ID } from '../type/openapiUtil.type';

/**
 * 국내 업종 현재 지수 - 코스피, 코스닥
 * 해외주식 종목/지수/환율기간별시세 - 환율
 */
export class OpenapiIndex extends Openapi {
  private readonly TR_ID_INDEX: TR_ID = 'FHPUP02100000';
  private readonly TR_ID_RATE: TR_ID = 'FHKST03030100';
  private readonly index_url: string =
    '/uapi/domestic-stock/v1/quotations/inquire-index-price';
  private readonly rate_url: string =
    '/uapi/overseas-price/v1/quotations/inquire-daily-chartprice';
  private kospi: string = '1001';
  private kosdaq: string = '2001';
  private rate: string = 'FX@KRW';
  constructor(
    @Inject('winston') private readonly logger: Logger,
    protected readonly datasource: DataSource,
    protected readonly config: OpenapiTokenApi,
  ) {
    super(datasource, config, 100);
  }

  //환율 정보의 경우 하루에 한번만 업데이트 됨
  @Cron('30 8 * * 1-5')
  async init() {}

  //kospi, kosdaq의 경우 여러번 업데이트 가능
  @Cron('* 9-14 * * 1-5')
  @Cron('0-30 15 * * 1-5')
  async start() {}

  protected async step() {}

  protected async getFromUrl() {}

  protected async convertResToEntity() {}

  protected async save() {}

  protected indexQuery(iscd: string, code: 'U' = 'U') {
    return {
      FID_COND_MRKT_DIV_CODE: code,
      FID_INPUT_ISCD: iscd,
    };
  }

  protected rateQuery(
    startDate: Date,
    endDate: Date,
    iscd: string,
    period: 'D' | 'W' | 'M' | 'Y' = 'D',
    code: 'N' | 'X' | 'I' | 'S' = 'X',
  ) {
    return {
      FID_COND_MRKT_DIV_CODE: code,
      FID_INPUT_ISCD: iscd,
      FID_INPUT_DATE_1: startDate,
      FID_INPUT_DATE_2: endDate,
      FID_PERIOD_DIV_CODE: period,
    };
  }
}
