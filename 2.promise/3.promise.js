//promise 链式调用 then then
let Promise = require('./promise.js');
let promise = new Promise((resolve, reject) => {
    resolve('hello')
})
// promise.then(data => {
//     return data;//then 方法中可以返回一个值 不是promise 会把这个结果放到下一次then
// }).then(data => {
//     return new Promise((resolve,reject) => {
//         setTimeout(() => {
//             resolve('hello');
//         },1000)
//     })
// }).then(data => {
//     return new Promise((resolve,reject) => {
//         setTimeout(() => {
//             reject('world');
//         },1000)
//     }) 
// }).then(data => {
//     console.log(data);
// }, err=> {
//     console.log(err); // 如果再失败的函数中返回的是普通值也会走到最外层
// }).then(() => {
//     // return undefined
// }, err=> {
//     console.log(err);
// }).catch(err => {//捕获错误 先找距离自己最近的如果没有错误捕获 会找到最终的catch方法

// })
//catch 代表统一处理错误  如果都灭有错误处理  会找最近的catch catch遵循then的规则
//。then 并不和jquery一样 返回 this promise 实现的是返回一个 新的promise 
// let promise2 = promise.then(() => {
//     // return 100;
//     return new Promise((resolve, reject) => {

//         resolve(new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 resolve(new Promise((resolve, reject) => {
//                     setTimeout(() => {
//                         reject('hello-world')
//                     }, 1000)
//                 }))
//             }, 1000)
//         }))
//     })
// })
// promise2.then(data => {
//     console.log('succss;' + data);
// })
// promise2.then().then().then(data => {
//     console.log('succss;' + data);
// }, err => {
//     console.log('err;' + err);
// })
//引用同一个对象 死循环  promise2
// let promise2 = promise.then(() => {
//     return promise2;
// })
// promise2.then(() => {}, err => {
//     console.log(err);
// })