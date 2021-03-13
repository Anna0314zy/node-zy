//函数柯里化 通用的柯里化函数
//判断元素的类型
// typeof constructor instanceof 
// function isType(typing) {
//     return function(params) {
//         return Object.prototype.toString.call(params) === `[object ${typing}]`;

//     }
// }
//让方法更具体一些 
// let utils = {};
// ['String', 'Number', 'Boolean'].forEach(method => {
//     utils[`is`+method] = isType(method);
// })
// console.log(utils.isNumber('f'))
// util.isString();
// util.isNumber();
// console.log(isType('hello', 'Strings'));
//分批传入参数
//科里化函数 每次都返回一个新函数 每次的参数都是一个参数 
function sum(a, b, c, d, e) {
    return a + b+ c+d+e;
}
const curring = (fn, arr = []) => { //arr收集参数
    let len = fn.length; //函数的长度就是参数个数
    // console.log(len, 'len');
    return function(...args) {
        let newArgs = [...arr, ...args]
        if (newArgs.length === len) {
            return fn(...newArgs);
        }else {
            return curring(fn, newArgs);
        }
    }

}
let newSum = curring(sum)

console.log(newSum(1)(2)(3)(4)(5));
console.log(newSum(1,2)(3,4,5))
//偏函数
// newSum(1,2)(2)(3,4,5)
function isType(typing, val) {
    return Object.prototype.toString.call(val) === `[object ${typing}]`;

}
let newIsType = curring(isType);
let isString = newIsType('String');
console.log(isString('hello'))