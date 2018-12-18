const path = require('path');
const mustache = require('mustache');
const Cache = require('lru-cache');
const myCache = new Cache({
    max: 3000,
    maxAge: 60 * 1000
});
const utils = require('../lib/utils');

const regs = {
    view: /\{%\s*view\s*([^%]+?)\s*%\}/,
    viewCache: /cache=["'](\d+)["']/i,
    extends: /\{%\s*extends\s*["']([^"']+)["']\s*%\}/im,
    include: /\{%\s*include\s*["']([^"']+)["']\s*%\}/igm,
    block: /\{%\s*block\s*([^\s\}]+)\s*%\}([\s\S]*?)\{%\s*endblock\s*%\}/igm,
    raw: /\{%\s*raw\s*%\}([\s\S]*?)\{%\s*endraw\s*%\}/igm
};

var views = [];
var render = null;
var context = null;

function getRenderResult(viewPath, scope) {
    viewPath = viewPath.toLowerCase();
    let html = views[viewPath];
    if (!html) return '';

    // 获取view设置的cache属性，并替换掉设置的原始字符串-
    let expires = 0;
    html = html.replace(regs.view, function (a, b) {
        let mat = regs.viewCache.exec(b);
        if (mat && mat.length > 1) {
            expires = parseInt(mat[1], 10) * 1000;
        }
        return '';
    });

    let content, key;
    if (expires > 0) {
        key = utils.getCtxCacheKey(context, viewPath);
        content = myCache.get(key);
    }
    if (!content) {
        // 渲染之前取出raw
        // let raws = [];
        // html = html.replace(regs.raw, function(a,b){
        //     raws.push(b);
        //     return `[[[raw=${raws.length-1}]]]`;
        // });
        html = html.replace(regs.raw, function(a,b){
            return `{{=[[[ ]]]=}}${b}[[[={{ }}=]]]`;
        });
        if (render) {
            content = render(html, scope);
        } else {
            content = mustache.render(html, scope);
        }
        if (expires > 0) {
            myCache.set(key, content, expires);
        }
        // raws.forEach(function(s, i){
        //     content = content.replace(`[[[raw=${i}]]]`, s);
        // });
    }
    // include
    content = content.replace(regs.include, function (a, b) {
        let vp = path.join(viewPath, '../', b);
        return getRenderResult(vp, scope);
    });

    return content;
}

module.exports = function (ctx, config, viewPath) {

    context = ctx;
    views = config.views;
    render = config.render;

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