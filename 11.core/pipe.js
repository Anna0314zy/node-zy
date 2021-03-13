const ReadStream = require('./ReadStream');
const WriteStream = require('./CreateWriteStream');

let rs = new ReadStream('./text.txt',{
    highWaterMark:4
})
let ws = new WriteStream('./copy.txt',{
    highWaterMark:1
})

rs.pipe(ws);
//可读流 可写流 双工流(能读能写)
//双工流 （能读能写 ）不是基于文件的
const {Duplex,Transform} = require('stream');
class MyDuplex extends Duplex{
    _read() {
        this.push('xxx');
        this.push(null);
    }
    _write(chunk,encoding,cb) {
        console.log(chunk);
        cb();
    }
}
let md = new MyDuplex;
md.on('data', function(chunk) {
    console.log('chunk');
})
md.write('ok');
//转换流 可以用于加密 压缩 可以把可写流转换成可读流
class MyTransform extends Transform{
    _transform(chunk,encoding,cb) {
        console.log(chunk,'mk');
        this.push(chunk.toString().toUpperCase());
        cb();
    }
}
let my = new MyTransform;
//监控用户输入内容
// process.stdin.on('data', function(chunk) {
//     process.stdout.write(chunk) //可写流
// })
// process.stdin.pipe(process.stdout);
process.stdin.pipe(my).pipe(process.stdout)