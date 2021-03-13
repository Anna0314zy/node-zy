const fs = require('fs');
const EventEmitter = require('events');

class ReadStrean extends EventEmitter{
   constructor(path, options={}) {
       super();
       this.path = path;
       this.autoClose = options.autoClose !== undefined ? options.autoClose : true;
       this.flags = options.flags || 'r';
       this.encoding = options.encoding || null;
       this.start = options.start || 0;
       this.end = options.end || undefined;
       this.highWaterMark = options.highWaterMark || 64*1024;
       this.open(); //默认就调用开启事件
       this.offset = this.start; //offset可以根据每次读取的位置发生变化
       this.flowing = false; //默认是非流动模式
       this.on('newListener', type => {
           if (type === 'data') {
               this.flowing = true;
               this.read();
           }
       })
   }
   pipe(ws) {
    this.on('data', (chunk) => {
       
        let flag = ws.write(chunk);
        if (flag) {
            this.pause();
        }
    })
    ws.on('drain',()=> {
        this.resume();
    })
   }
   pause() {
    this.flowing = false; 
   }
   resume() {
    if(!this.flowing) {
        this.flowing = true; 
        this.read();//继续读取
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
   read() {
     if (typeof this.fd != 'number') { //保证fd一定存在
         return this.once('open', () => this.read()); //读取完了 通知我一下
     }
     //fd 一定存在 Buffer是内存
     const buffer = Buffer.alloc(this.highWaterMark);
     // 2 真正要读取的个数 
     let howmushtoRead = this.end ? Math.min((this.end - this.offset + 1), this.highWaterMark): this.highWaterMark;
     fs.read(this.fd,buffer, 0, howmushtoRead, this.offset, (err, bytesRead) => {
       //bytesRead 真正要读取的个数
    //    console.log('bytesRead', bytesRead);
       if (bytesRead) {
           this.offset += bytesRead; //方便下次读取
           this.emit('data', buffer.slice(0, bytesRead)); //可能实际只有3个字节 highWaterMark > 3 
           if (this.flowing) {
               this.read();
           }
       }else {
           this.emit('end');
           if (this.autoClose) {
               fs.close(this.fd, () => {
                   this.emit('close');
               })
           }
       }
     })
   }

}
module.exports = ReadStrean;