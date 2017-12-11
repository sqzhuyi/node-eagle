const path = require('path');
const mustache = require('mustache');

const regs = {
    extends: /\{\%\s*extends\s*["']([^"']+)["']\s*\%\}/im,
    include: /\{\%\s*include\s*["']([^"']+)["']\s*\%\}/igm,
    block: /\{\%\s*block\s*([^\s\}]+)\s*\%\}([\s\S]*?)\{\%\s*endblock\s*\%\}/igm
};
var ctx = null;
var config = null;

function renderHtml(view) {

    let viewPath = view;
    if (!view.includes('/') && !view.includes('\\')) {
        viewPath = path.join(config._root, 'views', ctx.controller[0], view + '.html');
    }
    let html = getRenderResult(viewPath);
    // 检查是否使用了layout
    let mat = regs.extends.exec(html);
    if (mat && mat.length > 1) {
        let vp = path.join(viewPath, '../', mat[1]);
        // 获取渲染后的layout
        let layout = getRenderResult(vp);
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
    ctx.status = 200;
    ctx.set('content-type', 'text/html; charset=utf-8');
}

function getRenderResult(viewPath) {
    let html = config.views[viewPath.toLowerCase()];
    if (!html) return '';
    // mustache
    html = mustache.render(html, ctx.scope);
    // include
    html = html.replace(regs.include, function (a, b) {
        let vp = path.join(viewPath, '../', b);
        return getRenderResult(vp);
    });

    return html;
}

function renderJson(json) {
    ctx.body = json;
    ctx.status = 200;
    ctx.set('content-type', 'application/json; charset=utf-8');
}

// 统一的render函数-
async function render(viewOrJson) {
    // render函数不传参数时给默认值：action的名字==view的名字-
    if (!viewOrJson) {
        viewOrJson = ctx.controller[1];
    }
    // 如果是json数据，则走json输出-
    if (typeof viewOrJson === 'object' || viewOrJson[0] === '{' || viewOrJson[0] === '[') {
        renderJson(viewOrJson);
    } else {
        renderHtml(viewOrJson);
    }
}

module.exports = async function (_config) {
    ctx = this;
    config = _config;

    ctx.render = render;
};