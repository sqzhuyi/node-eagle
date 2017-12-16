module.exports = function renderJson(ctx, json) {
    ctx.body = json;
    if (ctx.status === 100) {
        ctx.status = 200;
    }
    ctx.set('content-type', 'application/json; charset=utf-8');
}