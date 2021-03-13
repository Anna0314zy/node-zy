const fs = require("fs");
let obj = {};
let eventObj = {
  arr: [], //中介存放 订阅的事件
  on(fn) {
    this.arr.push(fn);
  },
  emit() {
    this.arr.forEach((fn) => fn());
  },
};
fs.readFile("./a.text", "utf8", function (err, data) {
  if (err) return console.log(err);
  obj.name = data;
  eventObj.emit();
});
fs.readFile("./b.text", "utf8", function (err, data) {
  if (err) return console.log(err);
  obj.age = data;
  eventObj.emit();
});
eventObj.on(() => { //注册方法
  console.log("当前数据读取回来了");
  if (Object.keys(obj).length == 2) {
    console.log(obj); 
  }
});
// eventObj.on(() => {
//     console.log('readfile成功了')
// })
