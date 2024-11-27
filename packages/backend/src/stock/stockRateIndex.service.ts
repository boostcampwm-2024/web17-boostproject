import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { StockLiveData } from './domain/stockLiveData.entity';
import {
  StockIndexResponse,
  StockRateResponse,
} from './dto/stockIndexRate.response';
import { IndexRateGroupCode } from '@/scraper/openapi/type/openapiIndex.type';

@Injectable()
export class StockRateIndexService {
  constructor(
    private readonly datasource: DataSource,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async getRateIndexData(groupCode: IndexRateGroupCode) {
    const result = await this.datasource.manager.find(StockLiveData, {
      where: { stock: { groupCode } },
      relations: ['stock'],
    });

    if (!result.length) {
      this.logger.warn(`Rate data not found for group code: ${groupCode}`);
      throw new NotFoundException('Rate data not found');
    }
    return result;
  }

  async getStockRateData() {
    const groupCode: IndexRateGroupCode = 'RATE';
    const result = await this.getRateIndexData(groupCode);
    return result.map((val) => new StockRateResponse(val));
  }
  async getStockIndexData() {
    const groupCode: IndexRateGroupCode = 'INX';
    const result = await this.getRateIndexData(groupCode);
    return result.map((val) => new StockIndexResponse(val));
  }
}
