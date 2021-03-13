//promise a+ 规范 低版本
//高版本都支持promise
// 1.解决了哪些问题 异步并发 异步串行
//2.解决回调地狱 上一个输出是下一个输入
//3.错误处理非常方便 catch方法
//4.缺陷 依旧基于回调函数
/**
 * 1.promse 是一个类天生的  类需要传入 executor 执行器 默认会立即执行
   2.内部会提供两个方法reslove reject
   3.3个状态  一旦成功能就不能失败 一旦失败就不能成功
   PENDING: "PENDING", //等待
   RESOLVED: "RESOLVED", //成功
   REJECTED: "REJECTED", //失败
   4. 如果resolve 内部抛出错误 直接reject
   5.new promise 里面有回调函数 1秒后执行

 */

// const { resolve, reject } = require("./promise");

const Promise = require("./promise");

// let Promise = require('./promise.js');

//默认创建一个promise 状态就是pending fulfilled rejected promise有3个状态
//已经成功就不能失败
//如果抛出异常 按失败处理
let p = new Promise((resolve, reject) => {
  // resolve('xxxx');
  // throw new Error('错误');
  // reject('val');
  setTimeout(() => {
    reject("xxxxx");
  }, 1000);
});
//发布订阅 支持一个promise可以then多次 改变状态后会让then的函数执行
//搞个数组存一下
p.then(
  (data) => {
    console.log(data, "成功");
  },
  (error) => {
    console.error(error, "失败");
  }
);
p.then(
  (data) => {
    console.log(data, "成功");
  },
  (error) => {
    console.error(error, "失败");
  }
);
// promise.catch(e=> {
//     console.error(e, '失败');
// })

