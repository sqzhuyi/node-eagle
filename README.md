# node-eagle
基于Node的高性能MVC框架

    npm install node-eagle

## 依赖
Node8 + Koa2 + Mustache

## 特点
* route默认走controller，可自定义
* 不用手动render
* 指定非200的status后，不再执行后续代码
* controller/action/view不区分大小写
* 通过 ctx.get(key) 获取header/path/query/post参数

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
