# node-eagle
基于Node的高性能MVC框架

    npm install node-eagle

## 依赖
Node8 + Koa2 + Mustache

## 特点
* 高性能：不借助任何缓存，i5单核CPU可达到5400的QPS
* route默认走controller:name+action:name，可自定义
* 支持自动render和手动render：调用 this.render(viewName||viewPath||jsonData) 参数可选
* 指定status后（非100），不再执行后续代码
* controller/action/view 不区分大小写
* 通过 this.get(key) 获取header/path/query/post参数，不区分大小写
* 每个请求支持以下事件：onPreLoad/onPreRender/onRenderComplete，可以挂在controller跟action并列，也可以注册到context上，优先取context注册的事件
* 内容渲染采用Mustache模板引擎
* 页面嵌套、引用手动实现，支持常用语法：extends/include/block，如下：

_layout.html

    <body>
        {% include "./_header.html" %}
        {% block body %}
        <div>default content</div>
        {% endblock %}
        {% include "./_footer.html" %}
    </body>

index.html

    {% extends "../shared/_layout.html" %}
    {% block body %}
    <div class="body">
        {{{ content }}}
    </div>
    {% endblock %}

## 使用
1、在Node启动文件中加入以下代码：

    const Koa = require("koa");
    const app = new Koa();
    const eagle = require("node-eagle");
    const config = require("./config");

    eagle(app, config);

    app.listen(config.port, config.host, function(){
        console.log(`app start at ${config.host}:${config.port}`);
    });

2、按照MVC规则创建站点文件，如下：

    website
    ├ controllers
    │  └ home.js
    ├ views
    │  └ home
    │     └ index.html
    ├ config.js
    └ route.js

3、最重要的是，一定要看这个Demo：
https://github.com/sqzhuyi/node-eagle-demo
