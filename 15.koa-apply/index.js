//views -模板引擎的页面
// routes 路由 koa-router 根据不同功能来划分路由
//model 数据库相关的
//controller 空置期 每个路由都应该有一个控制器
//service 提供服务 空置期可以使用服务中的数据
//博客系统 文章管理 用户管理
const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const static = require('koa-static');
const router = require('./routes/index');
const path = require('path');
const views = require('koa-views');
const app = new Koa();

app.use(static(path.resolve(__dirname,'public')));
app.use(bodyParser());//要先解析 然后路由 注意中间件顺序
//模板引擎的目录
app.use(views(path.resolve(__dirname,'views'),{
    map:{
        'html':'ejs' //
    }
}))
app.use(router());//使用路由
app.listen(4000)
