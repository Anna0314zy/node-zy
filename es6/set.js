const arr1 = [1,2,4,3,3,2];//[1,2,3,4]
const arr2 = [2,3,4,5];//[2,3,4,5] 差集 [1]
//并集
const union = [...new Set([...arr1,...arr2])];
//交集 [2,3]
function inserction() {
    let s1 = new Set(arr1);
    let s2 = new Set(arr2);
    return [...s1].filter(x => s2.has(x));
}
function deff() {
    let s1 = new Set(arr1);
    let s2 = new Set(arr2);
    return [...s1].filter(x => !s2.has(x));
}
console.log(deff())
//要考虑到反复引用的问题 拷贝过了返回即可 否则会出现死循环
function deepClone(obj,hash = new WeakMap) {
    if (obj == null) return obj;
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Date) return new Date(obj);
    if (typeof obj !== 'object') return;
    //只可能是对象 或者 数组
    // 开始拷贝
    if (hash.has(obj)) return hash.get(obj);
    let instance = new obj.constructor;
    hash.set(obj, instance);
    for(let key in obj) { //会遍历原型上的属性
        if(obj.hasOwnProperty(key)) {
            instance[key] = deepClone(obj[key]); //拷贝的可能还是一个对象 递归
        }
    }
    return instance;
}
//深拷贝
// const obj = {a:2};
// JSON.parse(JSON.stringify(obj)); //缺陷目标对象不能放函数等特殊值
//如何实现深拷贝 递归+类型判断
//instance原理 判断当前__proto__ 是否有 RegExp.prototype
// let obj = /\d+/;
// let obj = [1,2, {a:0}];
let obj = {};
obj.a = obj; //循环引用需要做特殊处理
// 我要把拷贝后的结果保留起来 下次用的时候直接 返还回去即可
function deepClone(obj, hash = new WeakMap()) {
    if (obj == null) return obj;
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Date) return new Date(obj);
    // ...
    if (typeof obj !== 'object') return obj; //函数不需要拷贝
    //对象或者数组
    if (hash.has(obj)) return hash.get(obj);
   let instance = new obj.constructor;
   console.log(instance, 'instance');
   hash.set(obj, instance); //把当前拷贝前的和拷贝后的做一个映射
   for (let key in obj) { //会拷贝原型 的属性
       if (obj.hasOwnProperty(key)) {
           instance[key] = deepClone(obj[key], hash);
       }
   }
   return instance;

}
let newObj = deepClone(obj);
// obj.a = 9;
console.log(newObj)