const fs = require('fs');
const path = require('path');
const createReadStream = require('./ReadStream')
let rs = new createReadStream(path.resolve(__dirname, '1.text'), {
    flags: 'r',
    encoding: null,
    autoClose: null,
    start: 0, 
    autoClose: true,
    end: 4, //从哪里读到哪里
    highWaterMark: 2 //如果不写 默认是64*1024

})
// console.log(rs);
rs.on('error', function(err) {
    console.log(err);
})
rs.on('open', function(fd) {
    console.log(fd)
})
let arr = [];//拼接2进制
rs.on('data', function(chunk) {
    console.log(chunk.toString(), 'chunk')
    rs.pause();//控制速率 rs.resume(); 恢复
    arr.push(chunk)
})
rs.on('end', function() {
  console.log(Buffer.concat(arr).toString(), 'end')
})
rs.on('close', function() {
    console.log('close');
  })
setInterval(() => {
    rs.resume();
},1000)