const fs = require('fs');
const path = require('path');

function getController(ctx, router) {
    let path = ctx.path,
        params = ctx.params || {};

    // 从router配置查找controller定义-
    for (let i = 0; i < router.length; i++) {
        let rt = router[i];
        let result = path.match(rt.match);
        if (result) {
            // 获取path中的参数-
            for (let j = 1; j < result.length; j++) {
                params[j - 1] = result[j];
                // 如果配置的参数名称，则命名参数-
                if (rt.params && rt.params.join) {
                    params[rt.params[j - 1]] = result[j];
                }
            }
            ctx.params = params;
            return rt.controller.split('.');
        }
    }
    // 没有配置就走默认规则-
    if (path === '/') {
        return ['home', 'index'];
    }
    let arr = path.split('/');
    let ctl = [arr[1], 'index'];
    if (arr.length >= 2) ctl[1] = arr[2];

    // 获取path中的参数-
    for (let i = 3; i < arr.length; i++) {
        params[i - 3] = arr[i];
    }
    ctx.params = params;
    return ctl;
}
module.exports = async function (config) {
    var ctx = this;
    if (ctx.status !== 100) return;

    ctx.controller = getController(ctx, config.router || []);

    let ctl = config.controllers[ctx.controller[0]];
    let action = ctl ? ctl[ctx.controller[1]] : null;

    if (action) {
        await action.call(ctx, ctx.scope);
        if (ctx.status === 100) {
            await ctx.render();
        }
    } else {
        ctx.status = 404;
    }
    // 还没有正确的response
    if (![200, 301, 302].includes(ctx.status) && !ctx.body) {
        let fn1 = `${path.sep}error${path.sep}${ctx.status}.html`,
            find1 = false,
            fn2 = `${path.sep}error${path.sep}other.html`,
            find2 = false;

        for (let n in config.views) {
            if (n.includes(fn1)) {
                fn1 = n;
                find1 = true;
            }else if (n.includes(fn2)) {
                fn2 = n;
                find2 = true;
            }
        }
        if (find1) {
            await ctx.render(fn1);
        } else if (find2) {
            await ctx.render(fn2);
        }
    }

};