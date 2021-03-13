//每个  3个状态
const STATUS = {
  PENDING: "PENDING", //等待
  RESOLVED: "RESOLVED", //成功
  REJECTED: "REJECTED", //失败
};

// resolvePromise(promise2,x,resolve, reject)
//我们的promise 按照规范来写 就可以和别人的promise共用
//判断x的状态 是让promise2变成功态还是失败态
function resolvePromise(promise2, x, resolve, reject) {
  // console.log(promise2, 'promise2');
  //此方法  为了兼容所有的promise n个库中间 执行的流程是一样的
  //要尽可能的详细  不出错
  if (promise2 === x) {
    //a+规范  返回相同一个promise promise循环引用了
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  //TODO 看x 是普通还是promise 如果是promise要采用他的状态
  //判断 x是一个promise
  //x 如果是对象  或者函数 说明他有可能是promise
  let called; //假如别人的promise 又能成功 又能失败 做个兼容处理
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    //有可能是promise

    try {
      //取值 只取一次 不能x.then.call
      let then = x.then; // then 方法可能使用的getter定义
      if (typeof then === "function") {
        //只认为他是个promise
        //x为this  call改变this指向并且让函数执行
        //x 是一个promise this.call(this) 拿到取到的结果执行
        then.call(
          x,
          (y) => {
            //继续解析直到y是一个普通值 递归解析reslove的值
            if (called) return;
            called = true;
            //promise 内部可能还会是一个promise  要把y解析成普通值为止
            resolvePromise(promise2, y, resolve, reject);
            //data 就是hello
            // resolve(y); //调用返回的promise 用他的返回的结果 作为下一次then的结果
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x); //普通对象 直接reslove
      }
    } catch (e) {
      //取then出错了 在错误中又掉了该promise的成功
      if (called) return;
      called = true;
      reject(e); //取then失败 抛出异常
    }
  } else {
    // 不是promise 直接调用reslove
    resolve(x);
  }
}
class Promise {
  constructor(executor) {
    //宏变量
    this.status = STATUS.PENDING; //默认是等待它
    this.value = undefined;
    this.reason = undefined;
    //专门存放成功的回调函数
    this.onResolevedCallbacks = [];
    this.onRejectedCallbacks = [];
    //专门存放失败的回调函数
    //保证只有状态是等待的时候 才能更改状态
    const resolve = (value) => {
      //value 支持Promise.resolve(new Promise())
      if (value instanceof Promise) {
        value.then(resolve, reject); //递归解析直到是普通值为止
        return;
      }
      if (this.status === STATUS.PENDING) {
        this.value = value;
        this.status = STATUS.RESOLVED;
        //需要将成功的方法依次执行
        this.onResolevedCallbacks.forEach((fn) => fn());
      }
    };
    const reject = (reason) => {
      if (this.status === STATUS.PENDING) {
        this.reason = reason;
        this.status = STATUS.REJECTED;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    //执行executor 传入成功和失败
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e); // 如果内部出错直接将err手动的调用reject
    }
  }
  //catch就是没有成功的then方法
  catch(err) {
    return this.then(null, err);
  }
  then(onfulfilled, onrejected) {
    //处理前面调用的时候不停的then().then().then((data) => console.log(data));
    //表示onfulfilled, onrejected 是可选参数
    onfulfilled = typeof onfulfilled == "function" ? onfulfilled : (v) => v;
    onrejected =
      typeof onrejected == "function"
        ? onrejected
        : (err) => {
            throw err;
          };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.RESOLVED) {
        //执行then中的方法，可能返回的是一个普通值 或者promise我要判断x的；我要判断x是不是一个
        // promise2,如果是，需要让这个promise执行 并采用他的状态 作为promise的成功或者失败
        setTimeout(() => {
          try {
            //如果then里面调用的时候没传参数 promisea+规范 onfulfilled 是异步执行
            let x = onfulfilled(this.value); //onfulfilled规定是异步执行  因为要保证promise2要生成
            console.log(onfulfilled, onrejected, "onfulfilled, onrejected");
            //promise2拿不到的问题 判断x的状态 是让promise2变成功态还是失败态
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            //一旦then方法报错，就走到外层then的错误处
            console.log("error", e);
            reject(e);
          }
        }, 0);
      }
      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            let x = onrejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status === STATUS.PENDING) {
        //executor有异步逻辑  切片编程 方便添加逻辑
        this.onResolevedCallbacks.push(() => {
          //todo  ...切片编程

          setTimeout(() => {
            try {
              let x = onfulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onrejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }
  //静态方法 Prmose.resolve 类来调用
  static resolve(val) {
    return new Promise((resolve, reject) => {
      resolve(val);
    });
  }
  static reject(val) {
    return new Promise((resolve, reject) => {
      reject(val);
    });
  }
  static all(promises) {
    function isPromise(val) {
      return val && typeof val.then === "function";
    }
    return new Promise((resolve, reject) => {
      let results = [];
      let times = 0;
      function processData(index, val) {
        results[index] = val;
        if (++times === promises.length) {
          resolve(results);
        }
      }
      for (let i = 0; i < promises.length; i++) {
        let p = promises[i];
        if (isPromise(p)) {
          p.then((data) => {
            processData(i, data);
          }, reject);
        } else {
          processData(i, p);
        }
      }
    });
  }
}
//测试入口 测试时会调用这个方法
// npm install promises-aplus-tests -g
// promise-aplus-tests 文件名
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
// Promise.resolve = function (value) {
//   return new Promise((resolve, reject) => {
//     resolve(value);
//   });
// };
// Promise.reject = function (value) {
//   return new Promise((resolve, reject) => {
//     reject(value);
//   });
// };
// Promise.resolve = function(value) {
//     return
// }
// Promise.resolve可以接收一个promise  reject接收promise无意义
Promise.prototype.finally = function (callback) {
  //无论成功或者失败都执行
  return this.then(
    (data) => {
      //等待函数执行完毕 如果是promise需要执行完
      return Promise.resolve(callback()).then(() => data);
    },
    (err) => {
      return Promise.resolve(callback()).then(() => {
        throw err;
      });
    }
  );
};
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
      for(let i = 0; i < promises.length; i++) {
          let current = promises[i];
          if (current && typeof current.then === 'function') {
              //省略写法 data => resolve(data);
           current.then(resolve, reject);
         
          }else {
              resolve(current);
          }
      }
  })
}
module.exports = Promise;
//测试库  promises-aplus-tests
