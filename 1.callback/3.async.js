const fs = require("fs");
//解决异步问题  异步串行 --核心回调函数 两个文件读取完之后 再打印
let obj = {};
function after(times, callback) { //lodash
   return function() {
       --times == 0 && callback();
   }
}
let fn = after(2, () => {
    console.log(obj);
})

fs.readFile("./a.text", "utf8", function (err, data) {
    if (err) return console.log(err);
    obj.name = data;
  console.log(err, data);
  fn();
});
fs.readFile("./b.text", "utf8", function (err, data) {
    if (err) return console.log(err);
    obj.age = data;
    console.log(err, data);
    fn()
  });
  //发布订阅 观察者模式