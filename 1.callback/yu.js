//判断类型
// 用两个函数判断减少出错几率
function isType(typing, params) {
  return Object.prototype.toString.call(params) === `[object ${typing}]`;
}
console.log(isType("Number", 1));
//会有个问题 用户万一把类型Number 写错了 就找不到类型
//所以 我们把方法内置进去
function isType(typing) {
  return function (params) {
    return Object.prototype.toString.call(params) === `[object ${typing}]`;
  };
}
let uilts = {};
["Number", "String", "Boolean"].forEach((key) => {
  uilts[`is${key}`] = isType(key);
});

console.log(uilts.isNumber(9));

// 实现 sum(1)
function sum(a, b, c, d, e) {
  return a + b + c + d + e;
}
//arr 收集参数 参数收集够了才去执行fn
// 通用的
const curring = (fn, arr = []) => {
  let len = fn.length;
  return function (...args) {
    const newArgs = [...arr, ...args];
    if (newArgs.length === len) {
      return fn(...newArgs);
    } else {
      return curring(fn, newArgs);
    }
  };
};
let newSum = curring(sum);
console.log(newSum(1, 3, 3)(4, 5));
console.log(newSum(1)(2)(3)(4)(4));
let isNumber = isType("String");
console.log(isNumber(12));
//解决异步问题  异步串行 --核心回调函数 两个文件读取完之后 再打印
const fs = require("fs");
function after(times, cb) {
  return function () {
    if (--times == 0) {
      cb();
    }
  };
}
let fn = after(2, () => {
  console.log(obj);
});
let obj = {};

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
  fn();
});
//发布订阅模式--解决异步回调问题
let eventObj = {
  arr: [], //中介
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
  console.log(err, data);
  eventObj.emit();
});
//注册
eventObj.on(() => {
  if (Reflect.ownKeys(obj).length === 2) {
    console.log(obj);
  }
});
//观察者模式 --需要把被观察者放到观察者中  一旦状态发生改变 通知所有观察者
class Subject {
  constructor(name) {
    this.name = name;
    this.state = "在玩呢";
    this.observers = [];
  }
  attach(o) {
    this.observers.push(o);
  }
  setState(newState) {
    this.state = newState;
    this.observers.forEach((o) => o.update(this));
  }
}
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(baby) {
    console.log(`${baby.name}跟${this.name} 说 ${baby.state}`);
  }
}
let baby = new Subject("baby");
let o1 = new Observer("mama");
let o2 = new Observer("baba");
baby.attach(o1);
baby.attach(o2);
baby.setState("有人打我");
