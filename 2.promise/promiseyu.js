const STATUS = {
  PENDING: "PENDING", //等待
  RESOLVED: "RESOLVED", //成功
  REJECTED: "REJECTED", //失败
};
//对x的类型判断 常量可以直接跑出来 但是如果是promise 需要采取当前的promise的状态
//所有人写的promise都必须遵循规范 尽可能考虑别人的promise出错的地方
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    //a+规范  返回相同一个promise promise循环引用了
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    //尝试取then 方法 官网这么说的  （取then的时候 别人setter 定义 抛出异常）
    let called;
    try {
      let then = x.then;
      //可能别人如下定义 所以取then的时候取一次就行了
      //   Object.defineProperty('then', {
      //       set() {
      //           if (index++) {
      //               throw new Error('')
      //           }
      //       }
      //   })
      if (typeof then === "function") {
        //就认为他是一个promise

        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            //可能reslove(里面还有可能是一个promise) 递归解析
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r); //让当前的失败即可
          }
        );
      } else {
        //x就是一个普通对象
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    //x是一个普通值
    resolve(x);
  }
}
class Promise {
  constructor(executor) {
    this.status = STATUS.PENDING; //默认是等待它
    this.value = undefined;
    this.reason = undefined;
    //专门存放成功的回调函数 等状态变了 执行对应的函数
    this.onResolevedCallbacks = [];
    this.onRejectedCallbacks = [];
    //专门存放失败的回调函数
    const resolve = (value) => {
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.RESOLVED;
        this.value = value;
        //需要将成功的方法依次执行
        this.onResolevedCallbacks.forEach((fn) => fn());
      }
    };
    const reject = (reason) => {
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.REJECTED;
        this.reason = reason;
        //需要将成功的方法依次执行
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  catch(e) {
    this.then(null, e);
  }
  then(onfulfilled, onrejected) {
    onfulfilled = typeof onfulfilled === "function" ? onfulfilled : (v) => v;
    onrejected =
      typeof onrejected === "function"
        ? onrejected
        : (err) => {
            throw err;
          };
    let promise2;
    promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.RESOLVED) {
        setTimeout(() => {
          try {
            let x = onfulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
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
      //如果executor 中是一个异步函数 此时还是pending状态 收集起来 等时间到了执行
      if (this.status === STATUS.PENDING) {
        this.onResolevedCallbacks.push(() => {
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
  //Promise.resolve(123).then(data => {})
  static resolve(val) {
    return new Promise((resolve, reject) => {
      resolve(val);
    });
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }
  //异步串行并发 都成功了 才成功 如果有失败的立马失败

  static all(prmosies) {
    function isPromise(val) {
        return val && typeof val.then === "function";
    }

    return new Promise((resolve, reject) => {
      let results = [];
      let times = 0;
      function processData(val, index) {
        results[index] = val;
        if (++times === prmosies.length) {
          resolve(results);
        }
      }
      for (let i = 0; i < prmosies.length; i++) {
        let p = prmosies[i];
        if (isPromise(p)) {
          p.then((data) => {
              console.log(data, 'data');
            processData(data, i);
          }, reject);
        } else {
          processData(p, i);
        }
      }
    });
  }
}
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = Promise;
