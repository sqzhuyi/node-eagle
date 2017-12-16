module.exports = function (ctx, config) {
    let path = ctx.path,
        params = ctx.params || {},
        router = config.router || [];

    // 从router配置查找controller定义-
    for (let i = 0; i < router.length; i++) {
        let rt = router[i];
        let result = path.match(rt.match);
        if (result) {
            ctx.router = rt;
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