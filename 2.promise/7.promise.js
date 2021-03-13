const Promise = require("./promiseyu");
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("ok");
  }, 2000);
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("ok-p2");
  }, 1000);
});
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      let current = promises[i];
      if (current && typeof current.then === "function") {
        // current.then((data) => resolve(data), (err) => reject(err));
        current.then(resolve, reject);
      } else {
        resolve(current);
      }
    }
  });
};
// Promise.race = function(promises) {
//     return new Promise((resolve, reject) => {
//         for(let i = 0; i < promises.length; i++) {
//             let current = promises[i];
//             if (current && typeof current.then === 'function') {
//                 //省略写法 data => resolve(data);
//              current.then(resolve, reject);
           
//             }else {
//                 resolve(current);
//             }
//         }
//     })
//   }
Promise.race([p1, p2])
  .then((values) => {
    console.log(values);
  })
  .catch((err) => {
    console.log(err, "err");
  });
//无论成功或失败都收集  把接口都留下
// Promise.allSettled([p1,p2]).then(values => {
//     console.log(values);
// })
