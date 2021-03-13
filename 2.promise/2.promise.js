const fs = require("fs");
// const { resolve } = require("./promise");
// const Promise = require("./promise");
let read = (...args) => {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function (err, data) {
      if (err) reject();
      resolve(data);
    });
  });
};
/**6.多次 then 链式调用 //promise链式调用
链式调用 每次调用返回一个新的promise
1.不管成功或者失败 都会走到下一次的then方法中
7.1.如果then 方法中（成功或者失败）返回的不是一个promise 会将这个值传递给外层下一次then的成功结果
2.如果执行then方法中的方法出错了 抛出异常 走到下一个then的失败中
3.返回的是一个promise 会用这个promise的结果作为下一次then的成功或者失败
4..then 方法报错了 走到下一个then的err里面
*/
/**
 * catch 捕获异常就近处理
  catch 就是then 的别名 没有成功只有失败 找最近的优先处理 处理不了找下一层
 * 
 */
//什么时候 promise 会失败 1.出错会失败 2.返回的promise会出错
//then为什么可以链式调用 每次调用then 返回一个新的promise
read("./a.text", "utf8")
  .then(
    (data) => {
      throw new Error("fff");
      return read(data, "utf8");
    },
    (err) => {
      console.log(err, "err-first");
    }
  )
  .then(
    (data) => {
      console.log(data, "success");
    },
    (err) => {
      console.log("f" + err, "err---ttt");
    }
  )
  .catch((err) => {
    console.log(err);
  })
  .then((data) => {
    console.log(data);
  })
  .then((data) => {
    console.log(data);
  })
  .then((data) => {
    console.log(data);
  })
  .then((data) => {
    console.log(data);
  });
let p = read("./a.text", "utf-8");
const Promise1 = require("./promise");
console.log(p, "------");
let promise2 = p
  .then((data) => {
    return new Promise1((resolve, reject) => {
      resolve(
        new Promise((resolve, reject) => {
          resolve(
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve("ok");
              }, 100);
            })
          );
        })
      );
    });
  })
  .then((data) => {
    console.log(data);
  });
