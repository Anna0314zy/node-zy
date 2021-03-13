//abort 方法就是不要promise这次成功的结果了

// const { reject } = require("./promiseyu");

//


//p1是用户的 在内部再构建一个promise 与用户传入的组成一队
// function wrap(p1){
//     let abort;
//     let p2 = new Promise((resolve, reject) => {
//         abort=reject;
//     })
//     let newP = Promise.race([p1, p2]);
//     newP.abort = abort;
//     return newP;
// }
//实现中断 跟一个新的promise组合 新的promise中断了 promise就失败了
function wrap(promise) {
  let abort;
  let p2 = new Promise((reslove, reject) => {
     abort = reject;
  })
  let newP = Promise.race([promise, p2]);
  newP.abort = abort;
  return newP;
}
let p1 = new Promise((reslove, reject) => {
  setTimeout(() => {
    reslove("成功");
  }, 3000);
});
let p2 = wrap(p1);
setTimeout(() => {
  p2.abort('失败了');
}, 2000);
p2.then((data) => {
  console.log("s"+data);
}).catch((err) => {
  console.log("err" + err);
});

