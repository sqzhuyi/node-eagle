const path = require('path');
const mustache = require('mustache');

const regs = {
    extends: /\{\%\s*extends\s*["']([^"']+)["']\s*\%\}/im,
    include: /\{\%\s*include\s*["']([^"']+)["']\s*\%\}/igm,
    block: /\{\%\s*block\s*([^\s\}]+)\s*\%\}([\s\S]*?)\{\%\s*endblock\s*\%\}/igm
};

var views = [];

function getRenderResult(viewPath, scope) {
    let html = views[viewPath.toLowerCase()];
    if (!html) return '';
    // mustache
    html = mustache.render(html, scope);
    // include
    html = html.replace(regs.include, function (a, b) {
        let vp = path.join(viewPath, '../', b);
        return getRenderResult(vp, scope);
    });

    return html;
}

module.exports = function (ctx, config, viewPath) {

    views = config.views;

    let html = getRenderResult(viewPath, ctx.scope);
    // 检查是否使用了layout
    let mat = regs.extends.exec(html);
    if (mat && mat.length > 1) {
        let vp = path.join(viewPath, '../', mat[1]);
        // 获取渲染后的layout
        let layout = getRenderResult(vp, ctx.scope);
        // 获取view里的模块数据-
        let blocks = {};
        html = html.replace(regs.block, function (a, name, con) {
            if (!blocks[name]) {
                blocks[name] = con;
            } else {
                blocks[name] += con;
            }
            return a;
        });

        html = layout.replace(regs.block, function (a, name, con) {
            return blocks[name] || con;
        });
    }

    ctx.body = html;
    if (ctx.status === 100) {
        ctx.status = 200;
    }
    ctx.set('content-type', 'text/html; charset=utf-8');
}
