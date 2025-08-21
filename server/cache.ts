// High-performance in-memory cache for 10K+ concurrent users
interface CacheItem<T> {
  data: T;
  expiry: number;
  hits: number;
}

class HighPerformanceCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 10000; // Maximum cache entries
  private cleanupInterval = 60000; // Cleanup every minute

  constructor() {
    // Automatic cleanup of expired entries
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttlSeconds * 1000),
      hits: 0
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    // Increment hit counter
    item.hits++;
    return item.data as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  private evictLeastUsed(): void {
    let leastUsedKey = '';
    let leastHits = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.hits < leastHits) {
        leastHits = item.hits;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: ((this.cache.size / this.maxSize) * 100).toFixed(2) + '%'
    };
  }
}

// Global cache instance
export const cache = new HighPerformanceCache();

// Cache decorators for common operations
export function withCache<T>(
  key: string, 
  fetcher: () => Promise<T>, 
  ttlSeconds: number = 300
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      // Try cache first
      const cached = cache.get<T>(key);
      if (cached !== null) {
        resolve(cached);
        return;
      }

      // Fetch data and cache it
      const data = await fetcher();
      cache.set(key, data, ttlSeconds);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

// Frequently accessed data cache keys
export const CACHE_KEYS = {
  LOYALTY_REWARDS: 'loyalty_rewards',
  MENU_ITEMS: 'menu_items',
  DAILY_PROMOTIONS: 'daily_promotions',
  MEMBER_TIERS: 'member_tiers',
  ACTIVE_MEMBERS_COUNT: 'active_members_count',
  POPULAR_DISHES: 'popular_dishes'
} as const;