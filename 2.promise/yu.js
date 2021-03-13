//解决3个问题
// 1.传入executor 立马执行 当状态改变后执行 then方法
// 2.executor throw Error 走到then的reject中
// 3.executor 写一个异步回调 then中 一秒后打印出结果 把回调存起来 等状态改变了 执行
// const p = new Promise((reslove, reject) => {
//     console.time('cost');
//     // throw Error('抛出一个错误')
//     setTimeout(() => {
//         reject('ok');
//     }, 1000)
// }).then(data => {
//     console.timeEnd('cost');
//     console.log("data:", data)
//     return 12;
// }, err => {
//     console.log("err:", err)
// })
// const Promise = require("./promiseyu");
const fs = require('fs');

let read = (...args) => {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function (err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });
};
const a = function() {
    setTimeout(() => {
       console.log('ok');
    }, 1000)
}
Promise.resolve(a()).then(data => {
    console.log('success', data) //123
}, err => {
    console.log('err', err) //123
})
//  read = (...args) => {
//     let dfd = Promise.defer();
//     fs.readFile(...args, function (err, data) {
//         if (err) dfd.reject();
//         dfd.resolve(data);
//       });
//       return dfd.promise;
//   };
// read("./ab.text", 'utf8')
//   .then((data) => {
//     // throw new Error('我错了');
//     console.log(data, 'daya--')
//   })
//   .catch((err) => {
//       console.log(err, 'err');
//   })