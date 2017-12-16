/**
 * 提供页面级别的缓存策略，支持POST
 * @get 获取当前页面的缓存
 * @set 缓存当前页面内容
 */
const Cache = require('lru-cache');
const myCache = Cache({
    max: 3000,
    maxAge: 60 * 1000
});
const md5 = require('md5');

module.exports = {
    get: function (ctx) {
        if (ctx.router && ctx.router.cache && ctx.router.cache(ctx) > 0) {
            let key = ctx.url;
            if (ctx.method === 'POST') {
                key += md5(ctx.request.body);
            }
            let data = myCache.get(key);
            if (data) {
                ctx.body = data.body;
                ctx.status = 200;
                for (let name in data.headers) {
                    ctx.set(name, data.headers[name]);
                }
                ctx.set('x-page-cache', 'true');
                return true;
            }
        }
        return false;
    },
    set: function (ctx) {
        if (ctx.router && ctx.router.cache) {
            let expires = ctx.router.cache(ctx) * 1000;
            if (expires > 0) {
                let key = ctx.url;
                if (ctx.method === 'POST') {
                    key += md5(ctx.request.body);
                }
                let data = {
                    body: ctx.body,
                    headers: {}
                };
                for (let name in ctx.response.headers) {
                    data.headers[name] = ctx.response.headers[name];
                }
                myCache.set(key, data, expires);
                return true;
            }
        }
        return false;
    }
};