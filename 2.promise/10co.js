
// function* fun() {
//   yield 1;
//   yield 2;
//   console.log('oopp')
//   yield 3;
// }
// const it = fun();
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
let fs = require("fs").promises;
function* read() {
  let name;
  // try {
  //   name = yield fs.readFile("./a.text", "utf8");
  // } catch (e) {
  //   console.log("err", e);
  // }
  name = yield fs.readFile("./a.text", "utf8");
  
  let age = yield fs.readFile(name, "utf8");
  return age;
}
// async function f() {
//   await Promise.reject('出错了')
//     .catch(e => console.log(e));
//   return await Promise.resolve('hello world');
// }

// f()
// .then(v => console.log(v))
// async function f() {
//   await Promise.reject('出错了');
//   await Promise.resolve('hello world'); // 不会执行
// }
// async function f() {
//   await Promise.reject('出错了')
//     .catch(e => console.log(e));
//   return await Promise.resolve('hello world');
// }

// f()
// .then(v => console.log(v))
// async function f() {
//   try {
//     await Promise.reject('出错了');
//   } catch(e) {
//   }
//   return await Promise.resolve('hello world');
// }

// f()
// .then(v => console.log(v)).catch((err) => {
//   console.log(err);
// })
//模拟实现 利用generator 特性 it.next
//利用特性 第二次 it.next() 传递的参数 能传递给上一次的yield的返回值

// function co(it) {
//   //异步迭代采用函数的方式
//   return new Promise((resolve, reject) => {
//     function step(data) {
//       let { value, done } = it.next(data);
//       console.log(value);
//       if (!done) {
//         Promise.resolve(value).then((data) => {
//           step(data);
//         }, reject); //失败了就走了 reject；
//       } else {
//         resolve(value); //将最终的结果跑出去
//       }
//     }
//     step();
//   });
// }
// function co(genF) {
//   return new Promise(function (resolve, reject) {
//     const gen = genF();
//     function step(nextF) {
//       let next;
//       try {
//         next = nextF(); //迭代器
//       } catch (e) {
//         return reject(e);//这个能捕获整个promise的错误---让promise  reject了而已
//       }
//       if (next.done) {
//         return resolve(next.value);
//       }
//       //这让可以被try catch捕获
//       console.log(next.value, 'next.value');
//       Promise.resolve(next.value).then(
//         function (v) {
//           step(function () {
//             return gen.next(v);
//           });
//         },
//         function (e) {
//           step(function () {
//             return gen.throw(e);
//           });
//         }
//       );
//     }
//     step(function () {
//       return gen.next(undefined);
//     });
//   });
// }
// const co = require('co');
co(read)
  .then((data) => {
    console.log(data, "data----");
  })
  .catch((err) => {
    console.log(err, "err");
  });
function co(genf) {
  const gen = genf(); //生成器
  return new Promise((resolve, reject) => {
    function step(genF) {
      let next;
      try {
        next = genF();
      } catch (e) {
        reject(e);
      }
      if (next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(
        (v) => {
          return step(() => gen.next(v));
        },
        (err) => {
          return step(() => gen.throw(err));
        }
      );
    }
    step(() => gen.next(undefined));
  });
}
// const co = require('co');

// co(read)
// try {
//   co(read)
// }catch(e) {
//   console.log(e);
// }

// let it = read();
// let {value, done} = it.next();
// value.then(data => {
//     console.log(data);
//     let {value, done} = it.next(data);
//     value.then(data => {
//         console.log(data);
//     })
// })

//关于迭代 类数组
// function arg() {
//   let arr = [...{0:1,1:2,2:3,length:3,[Symbol.iterator]:function() {
//     let index = 0;
//     return {
//       next:() => {
//         return {done: index === this.length,value:this[index++]}
//       }
//     }

//   }}]
//   return arr;
// }
// function arg() {
//   let arr = [...{0:1,1:2,2:3,length:3,[Symbol.iterator]:function* () {
//     let index = 0;
//     while(index !== this.length) {
//       yield this[index++]
//     }

//   }}]
//   return arr;
// }
// console.log(arg());
// let value, done;
// try {
//   {value, done} = {value:'ff', done: false}
// }catch(e) {}
// console.log(value)
