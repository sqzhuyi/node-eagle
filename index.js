var bodyParser = require('koa-bodyparser');
var compress = require('koa-compress');

var render = require('./render');
var router = require('./router');

var getControllers = require('./lib/getControllers');
var getViews = require('./lib/getViews');
var init = require('./lib/init');


module.exports = function (app, config) {
    // 判断app是否为koa类型-
    if(!app.use){
        throw 'the first argument "app" must be a koa instance';
    }
    if(!config){
        config = {};
    }

    config._root = process.cwd();
    
    getControllers(config);
    getViews(config);
    
    app.use(async(ctx, next) => {
        await init.call(ctx, config);
        await next();
    });

    app.on("error", (err, ctx) => {
        if (ctx) {
            ctx.status = 500;
        }
        console.log(err);
    });

    app.use(bodyParser());

    app.use(compress({
        filter: function (content_type) {
            return /text/i.test(content_type)
        },
        threshold: 2048,
        flush: require('zlib').Z_SYNC_FLUSH
    }));

    // 提供render方法-
    app.use(async(ctx, next) => {
        await render.call(ctx, config);
        await next();
    });

    // 找到controller，执行action
    app.use(async(ctx, next) => {
        await router.call(ctx, config);
        await next();
    });

};
