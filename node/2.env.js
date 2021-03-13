// process.chdir('9.node');//手动更改目录
const path = require('path')
console.log(process.cwd()); //在哪里执行这个文件 目录就是哪里  代表的就是执行的文件的目录
console.log(path.resolve());//根路径
//env环境变量 
console.log(process.env);//环境变量的不同
//临时变量 mac export a=1 && node 2.env windows set  //cross-env 第三方包
//防盗系统的环境变量中 
let url = "";
if (process.env.NODE_ENV === 'development') {
    url = 'http';
}else {
    url = "prod"
}
console.log(url);
//nextTick
Promise.resolve().then(data => {
    console.log('then');
})
process.nextTick(() => {
    console.log('nextTick');
})
//node 事件环  不一定谁在前
// setTimeout(() => {
//     console.log('timeout');
// })
// setImmidiate(() => {
//     console.log('setImmidiate');
// })
//setImmidiate  如果再Io之后 会立即执行
setTimeout(() => {
    console.log('timer1');
    Promise.resolve().then(() => {
        console.log('then1');
    })
})
Promise.resolve().then(() => {
    console.log('then2');
    setTimeout(() => {
        console.log('timer2')
    })
})
//then2 
// setImmidiate(() => {
//     console.log('setImmidiate');
// })
