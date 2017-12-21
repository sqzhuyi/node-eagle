const mustache = require('mustache');

module.exports = {
    host: '127.0.0.1',
    port: 8081,
    // 可选
    root: __dirname,
    // 可选
    router: require('./router'),
    // 可选
    render: function(html, data){
        return mustache.render(html, data);
    }
};