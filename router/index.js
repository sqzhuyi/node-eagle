
const cache = require('../lib/pageCache');
// 获取当前url对应的controller
const getController = require('./getController');
// 执行controller对应的action
const doAction = require('./doAction');
// 渲染错误页面-
const printError = require('./printError');

// 判断当前请求是否已经有了response
function isDone(ctx) {
    return ctx.body || (ctx.status >= 200 && ctx.status < 400);
}


module.exports = async function (config) {
    var ctx = this;

    ctx.controller = getController(ctx, config);

    if(cache.get(ctx)){
        return;
    }

    if (ctx.status === 100) {
        await doAction(ctx, config);
    }
    if (!isDone(ctx)) {
        await printError(ctx, config);
    }

};