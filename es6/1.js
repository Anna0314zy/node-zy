//forEach 
// [[3,5,[5]]]
function sum(a, b) {
    return a + b;
}
function add$(str) {
    return 's'+ str
}
function len(str) {
    return str.length
}
// let compose = (...fns) => (...args) => {
//     let fn = fns.pop();
//     return fns.reduceRight((a,b) => b(a), fn(...args));
// }
// function compose(...fns) {
//    return fns.reduce(function(a,b) {
//        return function(...args) {
//            return a(b(...args))
//        }
//    })
// }
const compose = (...fns) => fns.reduce((a, b) =>(...args) => a(b(...args)));
const r1= compose(add$, len , sum)('a','b');
const r = add$(len(sum('a', 'b')));
console.log(r, r1, 'r')
// function compose(...fns) {
//    return function(...args) {
//        let fn = fns.pop();
//        return fns.reduceRight((a, b) => {
//            return b(a)
//        },  fn(...args))
      
//    }
// }
let keys = ['name', 'age'];
let values = ['珠峰', 19];
let obj = keys.reduce((a, b, i) => (a[b] = values[i],a), {});
console.log(obj);
Array.prototype.reduce= function(callback, prev) {
    for(let i = 0; i < this.length;i++) {
        if (typeof prev === undefined) {
            prev = callback(this[i], this[i+1], i+1, this);
            i++;
        }else {
            prev = callback(prev, this[i], i, this);
        }
    }
   
    return prev
}
let r3 = [1,2,3,4,5].reduce((prev, current) => prev + current, 10);
console.log(r3);
