import { DataSource } from 'typeorm';
import { openApiConfig } from '../config/openapi.config';
import { Stock } from '@/stock/domain/stock.entity';

export abstract class Openapi {
  constructor(protected readonly datasource: DataSource) {}

  protected abstract start(): Promise<void>;

  protected abstract interval(idx: number, stocks: Stock[]): Promise<void>;

  protected abstract step(idx: number, stock: Stock): Promise<void>;

  protected abstract getFromUrl(
    config: typeof openApiConfig,
    stockId: string,
  ): object;

  protected abstract convertResToEntity(res: object, stockId: string): object;

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
