import { Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set<T = any>(key: string, val: T, ttl: number): Promise<void> {
 
    await this.cacheManager.set<T>(key, val, ttl);
  }

  async get<T = any>(key: string): Promise<T> {
    const value = await this.cacheManager.get<T>(key);
    if (value === undefined || value === null) {
      throw new Error(`Key "${key}" not found in cache.`);
    }
    return value;
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
