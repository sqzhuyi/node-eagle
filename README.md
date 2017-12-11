# Eagle
基于Node的高性能MVC框架：Koa2+Mustache

route默认走controller，可自定义
不用手动render
指定非200的status后，不再执行后续代码

controller/action/view不区分大小写

通过 ctx.get(key) 获取header/path/query/post参数
