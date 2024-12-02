import { Injectable } from '@nestjs/common';
import { LocalCache } from '@/common/cache/localCache';
import { StockDataResponse } from '@/stock/dto/stockData.response';

@Injectable()
export class StockDataCache {
  private readonly localCache = new LocalCache<string, StockDataResponse>();

  set(key: string, value: StockDataResponse, ttl: number = 60000) {
    this.localCache.set(key, value, ttl);
  }

  get(key: string): StockDataResponse | null {
    return this.localCache.get(key);
  }
}