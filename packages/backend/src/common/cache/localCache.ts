import { PriorityQueue } from '@/scraper/openapi/util/priorityQueue';

type CacheEntry<T> = {
  value: T;
  expiredAt: number;
};

type CacheQueueEntry<T> = {
  value: T;
  expiredAt: number;
};

export class LocalCache<K, V> {
  private readonly localCache: Map<K, CacheEntry<V>> = new Map();
  private readonly ttlQueue: PriorityQueue<CacheQueueEntry<K>> =
    new PriorityQueue();

  constructor(private readonly interval = 500) {
    setInterval(() => this.clearExpired(), this.interval);
  }

  get(key: K) {
    const entry = this.localCache.get(key);
    if (!entry) {
      return null;
    }
    if (entry.expiredAt < Date.now()) {
      this.localCache.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: K, value: V, ttl: number) {
    const expiredAt = Date.now() + ttl;
    this.localCache.set(key, { value, expiredAt });
    this.ttlQueue.enqueue({ value: key, expiredAt }, expiredAt);
  }

  async delete(key: K) {
    this.localCache.delete(key);
  }

  clear() {
    this.localCache.clear();
  }

  private clearExpired() {
    const now = Date.now();
    while (!this.ttlQueue.isEmpty()) {
      const key = this.ttlQueue.dequeue()!;
      if (key.expiredAt > now) {
        this.ttlQueue.enqueue(key, key.expiredAt);
        break;
      }
      if (
        this.localCache.has(key.value) &&
        this.localCache.get(key.value)!.expiredAt === key.expiredAt
      ) {
        this.localCache.delete(key.value);
      }
    }
  }
}
