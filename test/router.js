/**
 * 页面路由采用正则匹配模式
 * @match RegExp [必需] 匹配url-path的正则
 * @params Array [可选] 为正则中的捕获组命名，可通过ctx.get(name)获取匹配到的值
 * @controller String [必需] 为当前path指定controller
 * @cache Function [可选] 缓存的条件
 */
module.exports = [{
    match: /^\/about(?:\/(\w+))?$/i,
    params: ['id'],
    controller: 'home.about',
    cache: function(ctx){
        return !ctx.state.user ? 60 : 0;
    }
}, {
    match: /^\/home\/index/i,
    controller: 'home.index',
    cache: function(ctx) {
        return 5;
    }
}];