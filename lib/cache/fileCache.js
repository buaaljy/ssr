
/**
 * 优化file读取过程
 * 先从缓存中读取，未命中再从file中读取
 * author: liujunying
 */
const fs = require('fs');
const path = require('path');
const CacheBase = require('./base');
const rootPath = path.resolve('');

class FileCache extends CacheBase {
  async getRealData(ctx, filePath) {
    const absPath = path.join(rootPath, filePath);
    ctx.logger.error(`[file-cache] read file from fs with path: ${absPath}`);
    if (fs.existsSync(absPath)) {
      return await fs.readFileSync(absPath, 'utf-8');
    }
    return false;
  }
}


const fileCache = new FileCache({
  name: 'file',
  cacheKeyPrefix: 'FILE_CACHE_',
  cacheOptions: {
    maxAge: 60 * 60 * 1000,
  },
});

module.exports = fileCache;
