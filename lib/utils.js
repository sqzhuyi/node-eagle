const md5 = require('md5');

module.exports = {
    // 获取跟当前请求有关系的缓存key
    getCtxCacheKey: function (ctx, key) {
        key += ':' + ctx.url;
        if (ctx.method.toUpperCase() === 'POST') {
            key += ':' + md5(ctx.request.rawBody);
        }
        return key;
    }
};