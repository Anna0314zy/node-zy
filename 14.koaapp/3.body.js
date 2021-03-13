//数据提交 服务端应该接收数据 进行响应 
//获取用户数据进行操作

const Koa = require('koa');
const app =new Koa(); 
const path = require('path');
const static = require('./koa-static')
const bodyParser = require('./koa-bodyparser')
app.use(bodyParser(path.resolve(__dirname, 'upload'))) //如果是文件传到这里来
//静态文件 处理静态资源的 找到了 就不向下执行了
app.use(static(path.resolve(__dirname, 'koa'))) //找到了就不要向下执行了

app.use(static(__dirname));
//当用户访问login时候 get -返回一个登录页
// app.use(async (ctx,next) => {
//     if (ctx.path === '/login' && ctx.method == 'GET') {
//        ctx.body = ''
//        }else {
//            next();
//        }
// })


//当访问/login post -登录操作

app.use(async (ctx,next) => {
    if (ctx.path === '/login' && ctx.method == 'POST') {
     ctx.set('Content-Type','text/html');
     ctx.body = ctx.request.body;
    }else {
        next();
    }
 })


app.listen(3000)