## koa express区别
- express 内部是通过回调函数实现的 koa es6
- 都是基于http进行封装的
- koa 内部比较小巧 express内部包含了很多中间件
- 可以根据自己的规则 实现mvc 没有约束 同一拨人开发的
- koa 底层使用了上下文对象 express内部是原生的res req
- koa 和 express 都有中间件的概念 express内部不支持promise