module.exports = function (config) {
    var ctx = this;

    // 初始值为100-continue，程序判断只要不是100则不再执行后续代码-
    ctx.status = 100;
    ctx.params = {};
    ctx.scope = ctx.scope || {};

    var ctxget = ctx.get;
    ctx.get = function (key) {
        key = key.toLowerCase();

        let val = ctxget(key);
        if (val) return val;

        for (let n in Object.keys(ctx.query)) {
            if (n.toLowerCase() == key) {
                return ctx.query[n];
            }
        }
        for (let n in Object.keys(ctx.params)) {
            if (n.toLowerCase() == key) {
                return ctx.params[n];
            }
        }
        for (let n in Object.keys(ctx.body)) {
            if (n.toLowerCase() == key) {
                return ctx.body[n];
            }
        }
    };
};