@addProperty(1, 2)
@log
@log2
class Animal {
  // static a = 1;//es7
  @log3
  aa = 1;
  static a() {
    return 1;
  }
  constructor(type) {
    this.type = type;
  }
  @changeEat
  eat() {
    console.log("吃饭");
  }
  say() {
    console.log("说话", this);
  }
  a = () => {
    //这个写法 加到了实例上 而不是原型上
    console.log(this);
  };
}
function changeEat(prototype, property, descriptor) {
  const oldFn = descriptor.value;

  descriptor.value = function () {
    console.log("喝水");
    oldFn.call(this);
  };
}
class Fish {}
// function addProperty(constructor) {
//     constructor.a = 1;
//     constructor.b = 1;

// }
function addProperty(a, b) {
  console.log("out addProperty");
  return function (constructor) {
    constructor.a = a;
    constructor.b = b;
    console.log("inner addProperty");
  };
}
// addProperty(Animal);

// addProperty(Fish);

function log() {
  console.log("out-log");
  return function (constructor) {
    console.log("inner-log");
  };
}
function log2() {
  console.log("out-log2");
  return function (constructor) {
    console.log("inner-log2");
  };
}
//修饰属性或者方法 第一个参数是当前类的原型
function log3(prototype, property, descriptor) {
  console.log(prototype, property, descriptor);
}
// out addProperty
// out-log2
// out-log
// inner addProperty
// inner-log
// inner-log
//es6 中提供了 静态方法 没有静态属性
let animal = new Animal("哺乳类");
//let fn = animal.say;fn()//错误的  es6规定不能这么使用 this是undefined
//如果这个方法直接被调用 返回这个类的实例

//npm i @babel/cli @babel/core @babel/preset-env -D
//npx babel 4.es6-class.js -o test.js --watch
class Dog extends Animal {
  //不写可以自动传过去 但是写了必须super()
  constructor(type) {
    super(type);
  }
}
let dog = new Dog("gougou"); //不写构造函数 下面可以直接拿到
console.log(dog.type);
