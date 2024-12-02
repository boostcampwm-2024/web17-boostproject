type CacheEntry<T> = {
  value: T;
  expireAt: number;
};

export class LocalCache<K, V> {
  private readonly localCache: Map<K, CacheEntry<V>> = new Map();

  get(key: K): V | null {
    const entry = this.localCache.get(key);
    if (!entry) {
      return null;
    }
    if (entry.expireAt < Date.now()) {
      this.localCache.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: K, value: V, ttl: number) {
    const expireAt = Date.now() + ttl;
    this.localCache.set(key, { value, expireAt });
  }

  delete(key: K) {
    this.localCache.delete(key);
  }

  clear() {
    this.localCache.clear();
  }
}
