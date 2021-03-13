const Koa = require('./koa');
const path = require('path');
const fs = require('fs');
const app = new Koa();
app.use(function(ctx) {
    //上下文对象 对原生的req 和 res 进行了封装 封装了一个新的对象 request response
    console.log(ctx.req.url) //原生的req对象
    console.log(ctx.request.req.url);//原生的
    console.log(ctx.request.path);//自己封装的 let {path} = url.parse(req.url)
    console.log(ctx.request.query);//自己封装的 let {path} = url.parse(req.url)
    console.log(ctx.path);
    // ctx.request.x = 1;
    // ctx.body = 'hello'
    // ctx.response.body = 'fff';
    // ctx.body = 'world';//body 并不是res.end 采取最后一次的结果
    // res.end('hello---')
    // ctx.set('Content-type', 'text/html')
    ctx.body = fs.createReadStream(path.resolve(__dirname, '1.html'));
    console.log(ctx.response.body);
    console.log(ctx.body)
})
app.listen(3000);
const app1 = new Koa();