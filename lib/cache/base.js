'use strict';

/**
 * cache base class
 * date: 2017-06-26 10:15
 * author: liujunying
 */

const assert = require('assert');
const LRU = require('lru-cache');
const defaultOptions = {
  max: 1000,               // 最多缓存1000条
  maxAge: 5 * 60 * 1000,    // 过期时间5分钟
};

class CacheBase {
  constructor(options) {
    const { name, cacheKeyPrefix } = options;
    assert(name && cacheKeyPrefix,
      `[cache-base] require name: ${name}, cacheKeyPrefix: ${cacheKeyPrefix}`
    );
    assert(this.getRealData, '[cache-base] require getRealData method');
    this.options = options;
    const cacheOptions = Object.assign({}, defaultOptions, options.cacheOptions);
    this.cache = LRU(cacheOptions);
  }

  async get(ctx, key) {
    const cacheData = this.getFromCache(key);
    if (cacheData) {
      ctx.logger.warn(`[cache-base] get ${key} from cache`);
      return cacheData;
    }
    const data = await this.getRealData(ctx, key);
    if (data) {
      ctx.logger.warn(`[cache-base] get ${key} from real data`);
      this.setCache(key, data);
    }
    return data;
  }
  getCacheKey(key) {
    return `${this.options.cacheKeyPrefix}${key}`;
  }
  getFromCache(key) {
    return this.cache.get(this.getCacheKey(key));
  }
  setCache(key, data) {
    this.cache.set(this.getCacheKey(key), data);
  }
  reset() {
    this.cache.reset();
  }
}

module.exports = CacheBase;
