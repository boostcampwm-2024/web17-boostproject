import { Injectable } from '@nestjs/common';
import { LocalCache } from '@/common/cache/localCache';
import { StockData } from '@/stock/domain/stockData.entity';

@Injectable()
export class StockDataCache {
  private readonly localCache = new LocalCache<string, StockData[]>();

  set(key: string, value: StockData[], ttl: number = 60000) {
    this.localCache.set(key, value, ttl);
  }

  get(key: string): StockData[] | null {
    return this.localCache.get(key);
  }
}
