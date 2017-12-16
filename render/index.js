const path = require('path');
const pageCache = require('../lib/pageCache');
const renderHtml = require('./renderHtml');
const renderJson = require('./renderJson');

var ctx = null;
var config = null;

// 统一的render函数-
async function render(viewOrJson) {
    // render函数不传参数时给默认值：action的名字==view的名字-
    if (!viewOrJson) {
        viewOrJson = ctx.controller[1];
    }
    // 如果是json数据，则走json输出-
    if (typeof viewOrJson === 'object' || viewOrJson[0] === '{' || viewOrJson[0] === '[') {
        renderJson(ctx, viewOrJson);
    } else {
        let viewPath = viewOrJson;
        if (!viewPath.includes('/') && !viewPath.includes('\\')) {
            viewPath = path.join(config.root, 'views', ctx.controller[0], viewPath + '.html');
        }
        // 不存在view文件，则输出json
        if (!config.views[viewPath.toLowerCase()]) {
            renderJson(ctx, ctx.scope);
        } else {
            renderHtml(ctx, config, viewPath);
        }
    }
    pageCache.set(ctx);
}

module.exports = async function (_config) {
    ctx = this;
    config = _config;

    ctx.render = render;
};