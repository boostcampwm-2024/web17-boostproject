import { Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { Openapi } from '../api/openapi.abstract';
import { OpenapiTokenApi } from '../api/openapiToken.api';
import { openApiConfig } from '../config/openapi.config';
import {
  ExchangeRate,
  ExchangeRateQuery,
  IndexRateGroupCodeStock,
  IndexRateId,
  IndexRateStockId,
  isExchangeRate,
  isStockIndex,
  StockIndex,
  StockIndexQuery,
} from '../type/openapiIndex.type';

import { TR_ID } from '../type/openapiUtil.type';
import { getOpenApi, getTodayDate } from '../util/openapiUtil.api';
import { OpenapiLiveData } from './openapiLiveData.api';
import { Json, OpenapiQueue } from '@/scraper/openapi/queue/openapi.queue';
import { Stock } from '@/stock/domain/stock.entity';
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';

/**
 * 국내 업종 현재 지수 - 코스피, 코스닥
 * 해외주식 종목/지수/환율기간별시세 - 환율
 */
export class OpenapiIndex extends Openapi {
  private readonly TR_ID_INDEX: TR_ID = 'FHPUP02100000';
  private readonly TR_ID_RATE: TR_ID = 'FHKST03030100';
  private readonly INDEX_URL: string =
    '/uapi/domestic-stock/v1/quotations/inquire-index-price';
  private readonly RATE_URL: string =
    '/uapi/overseas-price/v1/quotations/inquire-daily-chartprice';
  private KOSPI_ID: IndexRateId = IndexRateStockId.kospi;
  private KOSDAQ_ID: IndexRateId = IndexRateStockId.kosdaq;
  private USD_KRW_RATE: IndexRateId = IndexRateStockId.usd_krw;
  private readonly INTERVAL: number;
  constructor(
    @Inject('winston') private readonly logger: Logger,
    protected readonly datasource: DataSource,
    protected readonly config: OpenapiTokenApi,
    private readonly openapiLiveData: OpenapiLiveData,
    private readonly openapiQueue: OpenapiQueue,
  ) {
    const interval = 1000;
    super(datasource, config, interval);
    this.INTERVAL = interval;
    this.initData().then(() => this.start());
  }

  @Cron('* 9-14 * * 1-5')
  @Cron('0-30 15 * * 1-5')
  async start() {
    // await this.step((await this.config.configs()).length - 1);
    await this.getIndexData();
  }

  protected async step(idx: number) {
    const config = (await this.config.configs())[idx];
    this.getFromUrl(config);
  }

  protected async getFromUrl(config: typeof openApiConfig) {
    const indexOutputKospi = await this.getFromIndex(config, this.KOSPI_ID);
    const indexOutputKosdaq = await this.getFromIndex(config, this.KOSDAQ_ID);
    const rateOutput = await this.getFromRate(config, this.USD_KRW_RATE);
    if (
      isStockIndex(indexOutputKospi) &&
      isStockIndex(indexOutputKosdaq) &&
      isExchangeRate(rateOutput)
    ) {
      const liveData: StockLiveData[] = [];
      liveData.push(this.convertResToEntity(indexOutputKospi, this.KOSPI_ID));
      liveData.push(this.convertResToEntity(indexOutputKosdaq, this.KOSDAQ_ID));
      liveData.push(this.convertResToEntity(rateOutput, this.USD_KRW_RATE));
      for await (const data of liveData) {
        this.save(data);
      }
    } else {
      this.logger.warn('Index data save failed');
    }
  }

  protected async getFromIndex(config: typeof openApiConfig, stockId: string) {
    const query = this.indexQuery(stockId);

    try {
      const result = await getOpenApi(
        this.INDEX_URL,
        config,
        query,
        this.TR_ID_INDEX,
      );
      if (result && result.output) return result.output;
    } catch (error) {
      this.logger.warn(
        `Get index data failed : ${error}, try in ${this.INTERVAL / 1000} sec`,
      );
      setTimeout(() => this.getFromIndex(config, stockId), this.INTERVAL);
    }
  }

  protected async getFromRate(config: typeof openApiConfig, stockId: string) {
    const date = getTodayDate();

    const query = this.rateQuery(date, date, stockId);

    try {
      const result = await getOpenApi(
        this.RATE_URL,
        config,
        query,
        this.TR_ID_RATE,
      );
      if (result && result.output1) return result.output1;
    } catch (error) {
      this.logger.warn(
        `Get rate data failed : ${error}, try in ${this.INTERVAL / 1000} sec`,
      );
      setTimeout(() => this.getFromRate(config, stockId), this.INTERVAL);
    }
  }

  protected convertResToEntity(
    res: StockIndex | ExchangeRate,
    stockId: string,
  ): StockLiveData {
    if (isStockIndex(res)) {
      return this.convertResToStockIndex(res, stockId);
    } else {
      return this.convertResToExchangeRate(res, stockId);
    }
  }

  protected async save(entity: StockLiveData) {
    await this.openapiLiveData.saveLiveData(entity);
  }

  protected indexQuery(iscd: string, code: 'U' = 'U'): StockIndexQuery {
    return {
      fid_cond_mrkt_div_code: code,
      fid_input_iscd: iscd,
    };
  }

  protected rateQuery(
    startDate: string,
    endDate: string,
    iscd: string,
    period: 'D' | 'W' | 'M' | 'Y' = 'D',
    code: 'N' | 'X' | 'I' | 'S' = 'X',
  ): ExchangeRateQuery {
    return {
      fid_cond_mrkt_div_code: code,
      fid_input_iscd: iscd,
      fid_input_date_1: startDate,
      fid_input_date_2: endDate,
      fid_period_div_code: period,
    };
  }

  private async getIndexData() {
    this.openapiQueue.enqueue({
      url: this.INDEX_URL,
      query: this.indexQuery(this.KOSPI_ID),
      trId: this.TR_ID_INDEX,
      callback: this.getIndexDataCallback(this.KOSPI_ID, true),
    });
    this.openapiQueue.enqueue({
      url: this.INDEX_URL,
      query: this.indexQuery(this.KOSDAQ_ID),
      trId: this.TR_ID_INDEX,
      callback: this.getIndexDataCallback(this.KOSDAQ_ID, true),
    });
    this.openapiQueue.enqueue({
      url: this.INDEX_URL,
      query: this.indexQuery(this.USD_KRW_RATE),
      trId: this.TR_ID_INDEX,
      callback: this.getIndexDataCallback(this.USD_KRW_RATE, true),
    });
  }

  private getIndexDataCallback(stockId: string, isStock: boolean) {
    return async (data: Json) => {
      if (!data.output) return;
      if (isStock && isStockIndex(data.output)) {
        const indexData = this.convertResToEntity(data.output, stockId);
        await this.save(indexData);
      } else if (isExchangeRate(data.output)) {
        const rateData = this.convertResToEntity(data.output, stockId);
        await this.save(rateData);
      }
    };
  }

  private initKospiData() {
    const name = '코스피';
    const initStockData = new Stock();
    initStockData.id = IndexRateStockId.kospi;
    initStockData.groupCode = IndexRateGroupCodeStock.kospi;
    initStockData.name = name;
    return initStockData;
  }

  private initKosdaqData() {
    const name = '코스닥';
    const initStockData = new Stock();
    initStockData.id = IndexRateStockId.kosdaq;
    initStockData.groupCode = IndexRateGroupCodeStock.kosdaq;
    initStockData.name = name;
    return initStockData;
  }

  private initUsdKrwData() {
    const name = '원 달러 환율';
    const initStockData = new Stock();
    initStockData.id = IndexRateStockId.usd_krw;
    initStockData.groupCode = IndexRateGroupCodeStock.usd_krw;
    initStockData.name = name;
    return initStockData;
  }

  private async initData() {
    await this.saveStock(this.initKosdaqData());
    await this.saveStock(this.initKospiData());
    await this.saveStock(this.initUsdKrwData());
  }

  private async saveStock(data: Stock) {
    const target = Stock;

    await this.datasource.manager
      .getRepository(target)
      .createQueryBuilder()
      .insert()
      .values(data)
      .orUpdate(['is_trading'], ['id'])
      .execute();
  }

  private convertResToStockIndex(res: StockIndex, stockId: string) {
    const result = new StockLiveData();
    result.currentPrice = parseFloat(res.bstp_nmix_prpr);
    result.changeRate = parseFloat(res.bstp_nmix_prdy_ctrt);
    result.high = parseFloat(res.bstp_nmix_hgpr);
    result.low = parseFloat(res.bstp_nmix_lwpr);
    result.open = parseFloat(res.bstp_nmix_oprc);
    result.volume = parseInt(res.acml_vol);
    result.updatedAt = new Date();
    result.stock = { id: stockId } as Stock;
    return result;
  }

  private convertResToExchangeRate(res: ExchangeRate, stockId: string) {
    const result = new StockLiveData();
    result.currentPrice = parseFloat(res.ovrs_nmix_prpr);
    result.changeRate = parseFloat(res.prdy_ctrt);
    result.high = parseFloat(res.ovrs_prod_hgpr);
    result.low = parseFloat(res.ovrs_prod_lwpr);
    result.open = parseFloat(res.ovrs_prod_oprc);
    result.volume = parseInt(res.acml_vol);
    result.updatedAt = new Date();
    result.stock = { id: stockId } as Stock;
    return result;
  }
}
