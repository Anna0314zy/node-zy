
const EventEmitter = require('./events');
const fs = require('fs');
let Queue = require('./queue')
// class Writeable extends EventEmitter{
//     constructor(options) {
//         super();

//     }
//   write() {
//      this._write();
//   }
// }
class WriteStream extends EventEmitter{
    constructor(path, options ={}) {
        super();
        this.path = path;
        this.flags = options.flags || 'w';
        this.encoding = options.encoding || 'utf8';
        this.autoClose = options.autoClose !== undefined ? options.autoClose : true;
        this.highWaterMark = options.highWaterMark || 16*1024;
        this.open();
        //要判断第一次写入 还是第二次写入
        this.writing = false; //用来描述当前是否有正在写入的操作
        this.needDrain = false;//默然是否触发drain事件
        this.len = 0; //需要统计的长度
        this.offset = 0;//每次写入的偏移量
        this.cache = new Queue();//用来实现缓存的
    }
    write(chunk, encoding = this.encoding,cb=()=>{} ) { //判断是真的写入 还是需要放到缓存中
      //用户调用write 写入发数据可能是stringOrBuffer
      chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      this.len += chunk.length;
      let ret = this.len < this.highWaterMark;
      if (!ret) { //超过预期 达到预期 就改变触发drain
        this.needDrain = true;
      }
      if (this.writing) {
          this.cache.offer({
              chunk,
              encoding,
              cb
          })

      }else {
          this.writing = true;//表示正在写入
          this._write(chunk, encoding, () => {
              cb();
              this.clearBuffer();
          })
      }
      return ret;
    }
    clearBuffer() {
        let data = this.cache.poll();
        if (data) {
          let {chunk,encoding,cb} = data;
          this._write(chunk, encoding,() => {
              cb();
              this.clearBuffer();
          })
        }else {
            this.writing = false; //缓存都清掉了
            if (this.needDrain) {
                this.needDrain = false;
                this.emit('drain');
            }
        }
    }
    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) {
                this.emit('error',err);
            }
            this.fd = fd; //将文件描述符保存起来
            this.emit('open', fd);
         })
    }
    _write(chunk,encoding,cb) { //fs._write
    //   console.log('_write');
      if (typeof this.fd !== 'number') {
          return this.once('open', () => this._write(chunk, encoding,cb));
      }
    //   console.log(this.fd, 'fd')
      fs.write(this.fd,chunk,0,chunk.length,this.offset,(err, written) => {
          this.len -= written;
          this.offset += written;
          cb();
      })
    }
}
module.exports = WriteStream;
