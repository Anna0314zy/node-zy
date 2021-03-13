//可枚举的属性 可以被循环
// let obj ={};
// Object.defineProperties(obj , a, {
//     enumerable: true,//是否可枚举
//     configurable: true,//是否可删除
//     writable: true,//是否可删除
//     // value: 100
//     get() { //属性访问器

//     },
//     set() {

//     }
// });
// let obj = {
//    a: 10,
//    b: {c:9}
// }
let obj = [1,3,{c:9}];
function update() {
    console.log('视图更新')
}
// let proto = Object.create(Array.prototype);
// ['shift','push', 'pop','shift','reverse','sort','splice'].forEach(method => {
//     proto[method] = function() {
//         update();
//         let old  = Array.prototype[method];//调用原型上的方法 添加新的逻辑
//         old.call(this, ...arguments);
//     }
// })
// function observer(obj) {
//     if (Array.isArray(obj)) return obj.__proto__ = proto;
//   if (typeof obj !== 'object') return obj;
//   for(let key in obj) {
//       if (typeof obj[key] === 'object') observer(obj[key]);
//       defineReactive(obj, key, obj[key])
//   }
// }
// function defineReactive(obj, key, value) {
//     Object.defineProperty(obj, key, {
//         set(newVal) {
//             if (typeof obj[key] === 'object') observer(newVal);//obj.b = {d:9};
//             update();
//             value = newVal;
//         },
//         get() {
//             return value;
//         }
//     })
// }
let proto = Object.create(Array.prototype);//继承数组原型的方法;
//如何把参数传过去呢？
['shift','unshift','pop','push','splice','sort','reverse'].forEach(method => {
    proto[method] = function() {
        update();
        let old = Array.prototype[method];
        old.call(this, ...arguments);
    }
})
function observer(obj) {
    if (Array.isArray(obj)) return obj.__proto__ = proto;//借助数组的方法
    if (typeof obj !== "object") return;
    for(let key in obj) {
        if (typeof obj[key] === 'object') observer(obj[key]);
        defineReactive(obj, key, obj[key])
    }
}
function defineReactive(obj,key,value) {
  Object.defineProperty(obj, key, {
      get() {
         return value;
      },
      set(newVal) {
          update();
          return value = newVal;
      }
  })
}
function set(target, key, value) {
    update();
    defineReactive(obj,key,value)
}
observer(obj);
//如果是数组如何劫持
obj.splice(1,1,{c:8});
// obj.a = 11;
// obj.b.c = 11;
// set(obj, 'c', 10)
// obj.c = 10;
// obj.b={d:90};
// console.log(obj.b.d);
console.log(JSON.stringify(obj))

