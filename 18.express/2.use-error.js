// 默认当前版本
let express = require('./express');

let app = express(); //中间件必须在真实的处理路由之前
//路由要匹配路径和方法 但是中间件不需要匹配方法 这个路径匹配跟cookie的path一样
// 可以是否向下执行
app.use('/',function(req,res,next){
    console.log(1)
    next('error'); //只要传递参数 就代表错误了 忽略，走到错误中间件
})
app.use(function(req,res,next){
    console.log(2)
    next();
})
app.use('/user',function(req,res,next){
    console.log(3)
    next();
})
app.use('/user/a',function(req,res,next){
    console.log(4)
    next();
})
app.use((err,req,res,next) => {
    next(err+'333')
})
app.use((err,req,res,next) => {
    res.end(err+'4444')
})
app.listen(3000,function() {
	console.log('server start 3000')
});
