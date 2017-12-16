const path = require('path');

module.exports = async function (ctx, config) {
    let fn1 = `${path.sep}error${path.sep}${ctx.status}.html`,
        find1 = false,
        fn2 = `${path.sep}error${path.sep}other.html`,
        find2 = false;

    for (let n in config.views) {
        if (n.includes(fn1)) {
            fn1 = n;
            find1 = true;
        } else if (n.includes(fn2)) {
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