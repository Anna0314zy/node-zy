//koa-router koa-combine-routers
let  articleRouter = require('./articleRouter');
let  userRouter = require('./userRouter');
let combineRouter = require('koa-combine-routers');

module.exports = combineRouter(articleRouter,userRouter);