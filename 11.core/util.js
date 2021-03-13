//我希望将一些模块转换成promise语法
//拷贝文件
let ncp = require('ncp');
let path = require('path');
let util = require('util');
let {promisify,inherits} = require('util');
promisify = fn => (...args) => {
   return new Promise((resolve, reject) => {
       fn(...args, function(err) { //只针对node 因为node 是err 第一个参数 虽然你没传回调 但是node我就是这种机制
           if(err)reject(err)
           resolve();
       });
   })
}
// ncp = promisify(ncp);
(async() => {
    await ncp(path.resolve(__dirname, 'note.md'), path.resolve(__dirname, 'node1.md'), (err) => {
        console.log(err)
    })
    console.log('拷贝成功')
})()
//inherits node内部不是ES6写的  实现类的继承
function Parent() {
  
}
function Child() {
    Parent.call(this);
}
Child.prototype.__proto__ = Parent.prototype;
Reflect.setPrototypeOf(Child.prototype, Parent.prototype);
Child.prototype = Object.create(Parent.prototype);
//只继承公共方法
inherits(Child, Parent); //等价于Reflect.setPrototypeOf(Child.prototype, Parent.prototype);
// console.log(util);
console.log(util.inspect(Array.prototype,{showHidden:true}));
console.log(util.isPrimitive('12'));
console.log(util)

