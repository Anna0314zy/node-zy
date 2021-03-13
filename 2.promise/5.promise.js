let fs = require('fs').promises;

let getName = fs.readFile('./a.text', 'utf8');
let getAge = fs.readFile('./b.text', 'utf8');

//返回的是一个promise 顺序固定
//并发执行 其中一个失败就真的失败了
Promise.all([1,getName, getAge, 2]).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err, 'errr');
})
// Promise.prototype.finally
// let Promise = require('./promise');
//原型上的方法 无论如何都执行 没有参数 其实就是执行then方法
//内部可以返回一个promise 成功或者失败的结果将作为then的参数
const Promise = require('./promiseyu')

Promise.prototype.finally = function(callback) {
    return this.then((data)=>{
        return Promise.resolve(callback()).then(() => data);//让本次的返回值作为下一次的参数
    },(err)=>{
        return Promise.resolve(callback()).then(() => {throw err});//让本次的返回值作为下一次的参数
    })
}
Promise.resolve(123).finally(data => { //这里传入的函数 无论如何都执行
    console.log('finally', data); //没有任何参数
    //可以返回一个promise 等待效果 
    console.time('cost')
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('ok');
        }, 1000)
    })
}).then(data => {
    console.timeEnd('cost');
    console.log(data); //会拿到上一次的结果
}, err => {
    console.log(err, 'err-iiii')
    console.timeEnd('cost')
})