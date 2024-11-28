import { DataSource } from 'typeorm';
import { openApiConfig } from '../config/openapi.config';
import { OpenapiTokenApi } from './openapiToken.api';
import { Stock } from '@/stock/domain/stock.entity';

export abstract class Openapi {
  constructor(
    protected readonly datasource: DataSource,
    protected readonly config: OpenapiTokenApi,
    protected readonly gapTime: number,
  ) {}
  protected abstract step(idx: number, stock: Stock): Promise<void>;

  protected abstract getFromUrl(
    config: typeof openApiConfig,
    stockId: string,
  ): object;

  protected abstract convertResToEntity(res: object, stockId: string): object;

  protected abstract save(entity: object): Promise<void>;

  async start() {
    const stock = await this.getStockId();
    const len = (await this.config.configs()).length;
    const stockSize = Math.ceil(stock.length / len);
    let i = 0;
    while (i < len) {
      this.interval(i, stock.slice(i * stockSize, (i + 1) * stockSize));
      i++;
    }
  }

  protected async interval(idx: number, stocks: Stock[]) {
    let time = 0;
    for (const stock of stocks) {
      setTimeout(() => this.step(idx, stock), time);
      time += this.gapTime;
    }
  }

  protected async getStockId() {
    const entity = Stock;
    const manager = this.datasource.manager;
    const result = await manager.find(entity, {
      select: { id: true },
      where: { isTrading: true },
    });
    return result;
  }
}
