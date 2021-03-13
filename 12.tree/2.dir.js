//文件夹操作
const fs = require('fs');
const path = require('path');
//如何创建文件夹  如何删除文件夹 如何判断是不是文件夹 文件夹放的有啥内容
//异步代码稍微复杂一些
//异步方法 mkdir
// fs.mkdir('a/b',() =>{}) //创建目录前必须保证父目录存在
// fs.rmdir('a/b',err=>{console.log(err)})//删除目录需要保证目录中的内容是空的
//遍历树
// fs.readdir('a',(err,dirs)=> {
//     console.log(dirs) //[ 'a.txt', 'b' ] 只能有一层 读取的结果只有儿子一层
//     dirs = dirs.map(item => {
//         let p = path.join('a', item);
//         fs.stat(p, (err, stat) => {
//             // console.log(stat.isDirectory(), stat.isFile());
//             if (stat.isFile()) {
//                 fs.unlink(p,()=>{})
//             }
//         })
//         return p//[ 'a/a.txt', 'a/b' ] dirs
//     })
//     console.log(dirs, 'dirs')
// })
//fs.readdir 只能读一层  fs.stat  
//异步删除  异步串行 异步并行
// function rmdir(dir,cb) {
//     fs.stat(dir,(err,statobj) => {
//         if (statobj.isFile()) {
//             fs.unlink(dir,cb);
//         }else {
//             //读取文件夹中的内容
//             fs.readdir(dir, (err, dirs) => {
//                 dirs = dirs.map(item => path.join(dir,item));
//                 console.log(dirs); //[ 'a/b', 'a/c', 'a/i.js' ] 
//                 //先删除儿子 再删除老子
//                 let idx = 0;
//                 function next() {
//                     if (idx === dirs.length) return fs.rmdir(dir,cb)
//                    let current =  dirs[idx++];
//                    rmdir(current,next);
//                 }
//                 next();
//             })
//         }
//     });

// }
//异步并行
function rmdir(dir,cb) {
    fs.stat(dir,(err,statobj) => {
        if (statobj.isFile()) {
            fs.unlink(dir,cb);
        }else {
            //读取文件夹中的内容
            fs.readdir(dir, (err, dirs) => {
                // console.log(dirs);
                dirs = dirs.map(item => path.join(dir,item));
                //并发删除多个儿子 儿子删除完毕 通知父亲
                if(dirs.length === 0) {
                    return fs.rmdir(dir,cb)
                }
                
                let idx = 0;
                function done() {
                    if (++idx == dirs.length) {
                        fs.rmdir(dir,cb);
                    }
                }
                for(let i = 0; i < dirs.length;i++) {
                    let dir = dirs[i];
                    rmdir(dir,done);
                }
            })
        }
    });

}
rmdir('a', function() {
    console.log('删除成功')
})