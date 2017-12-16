module.exports = async function (ctx, config) {

    let ctl = config.controllers[ctx.controller[0]];
    let action = ctl ? ctl[ctx.controller[1]] : null;

    if (!ctl) {
        ctx.status = 404;
        return;
    }
    let onPreLoad = ctl['onPreLoad'] || ctx['onPreLoad'];
    if (onPreLoad) {
        await onPreLoad.call(ctx, ctx.scope);
    }
    if (!action) {
        ctx.status = 404;
        return;
    }
    if (ctx.status === 100) {
        await action.call(ctx, ctx.scope);
    }
    let onPreRender = ctl['onPreRender'] || ctx['onPreRender'];
    if (ctx.status === 100 && onPreRender) {
        await onPreRender.call(ctx, ctx.scope);
    }
    if (ctx.status === 100) {
        if (ctx.body) {
            ctx.status = 200;
        } else {
            await ctx.render();
        }
    }
    let onRenderComplete = ctx['onRenderComplete'] || ctl['onRenderComplete'];
    if (onRenderComplete) {
        await onRenderComplete.call(ctx, ctx.scope);
    }
}