const Koa = require("./koa/lib/application");
const path = require("path");
const fs = require("fs");
const app = new Koa();
//中间件 1.可以决定是否向下执行 做权限 统一拦截 不合法 不向下执行
//2/.默认可以在中间件中扩展属性和方法
//基于中间件写一些插件
//1.koa中所有的use中传入的方法 都会被包装成promise
//2.会把所有的promise变成一个promise链 内部 next前面必须要加await 或者直接return 也有等待效果
//3.所有的异步逻辑都要包装成promise

const sleep = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
      console.log("sleep");
    }, 1000);
  });
};
//如果加await 需要等待第二个的异步逻辑执行完
//如果没有加 await 不关心第二个的异步逻辑
app.use(async function (ctx, next) {
  console.log(1);
// ctx.body = '2';
   next(); //await next() --> 需要等待下一个中间件完成 一般都统一加上await
  console.log(2);
  // throw new Error('捕获异常')
  // ctx.body = '9';
});

app.use(async function (ctx, next) {
  console.log(3);
  // await sleep();
  // ctx.body = '6';
  await next();
  next();
  console.log(4);
  // ctx.body = '8';
});
app.use(async function (ctx, next) {
  console.log(5);
  await next();
  console.log(6);
});
app.listen(3000);
app.on('error',(err) => {
  console.log(err, '服务器错误========')
})
