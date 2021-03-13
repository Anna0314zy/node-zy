const fs = require('fs');
// const path = require('path');
//1.读取文件 读取到的结果默认都是buffer
//2写入的时候 会清空文件内容 并且以utf8格式类型写入
//运行如果用相对路径 会以process.cwd()切换路径 可能会导致不同路径下结果不同
// fs.readFile(path.resolve(__dirname, 'note.md'), 'utf8', function(err, data){
//     console.log(data);
// })
//node采用了流的方式
function copy(source, target, cb) {
   const BUFFER_LENGTH = 3;
   let read_position = 0;
   let write_positon = 0;
   const buffer = Buffer.alloc(BUFFER_LENGTH);
   fs.open(source, 'r', function(err, rfd) {
        fs.open(target, 'w', function(err, wfd) {
            function next() {
                fs.read(rfd,buffer,0,BUFFER_LENGTH, read_position,function(err, bytesRead) {
                    if(err) return cb(err);
                    if (bytesRead) {
                        fs.write(wfd,buffer,0,bytesRead,write_positon,function(err,written) {
                            read_position += bytesRead;
                            write_positon += bytesRead;
                            next();
                        });
                    }else {
                        fs.close(rfd,() => {});
                        fs.close(wfd,() => {});
                        cb();
                    }
                   
                })
            }
            next();
        })
   })
}
copy('./2.js', './xxx.js', function() {
    console.log('copy-success');
})