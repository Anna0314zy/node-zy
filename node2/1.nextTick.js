const fs = require('fs')
//根据性能影响 执行顺序会不同
//timer阶段
setTimeout(() => {
    console.log('setTimeout')
})
//一种
//check阶段
setImmediate(() => {
    console.log('setImmdiate')
})

//这种执行顺序是一定的 setImmdiate setTimeout
fs.readFile('./note.md', function() {
    //i / o 轮询会执行i.o回调 如果没有定义setImmediate 会等待剩下的I/O完成 或者定时器到达时间
    setTimeout(() => {
        console.log('setTimeout')
    })
    //一种
    //check阶段
    setImmediate(() => {
        console.log('setImmdiate')
    })
})