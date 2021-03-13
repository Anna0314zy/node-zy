const fs = require('fs');
const path = require('path');

const CreateWriteStream = require('./CreateWriteStream.js')
const ws = new CreateWriteStream(path.resolve(__dirname, 'text.txt'),{
    flags: 'w',
    encoding: 'utf8',
    autoClose: true,
    highWaterMark: 5//默认16k

})
//ws 可写流
//ws.write() ws.end(); ws.on('open)
ws.on('open', function(fd) {
    console.log(this, 'this----')
    // console.log(fd);
})
// let flag = ws.write('1');//如果写入的字节大于highWaterMark 会返回一个标识 写入的字节大于2 就返回falsse
// console.log(flag);
// flag = ws.write('1');
// console.log(flag);
//ws.write('1'); //异步写入 多次写入要有一个缓存区 (链表)因为不能同时操作一个文件
let i = 0;
function write() {
    let flag = true;
    while(i < 10 && flag) {
        flag = ws.write(''+i++);
        console.log(i, flag)
    }
}
write()
//抽干 当我们的内容达到预期后 超过预期时会触发此方法（必须等这么内容写到文件中才执行）
ws.on('drain', () => {
    write();//等写完第一个 需要再写第二个
    console.log('清空');

})
//console.log(flag, 'flag'); //将多个异步任务进项排队依次执行
//为什么要采用链表 数组 栈 队列 链表 树
//用链表可以实现栈或者队列 （取头部性能更高一些）
//第一次写入操作是真的向文件中写入 -- 后续都放在缓存中
//flag主要用来限制是否需要继续读取 rs.pause resume

//我只想用一个空间来写入10个数
//1.格式化数据 默认需要打开的文件
//2 用户会调用write方法 Writeable接口实现了write方法 内部会调用_write
