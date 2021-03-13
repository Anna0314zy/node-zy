//服务器 返回静态文件 返回数据
const http = require("http");
const path = require("path");
const url = require("url");
const fs = require("fs").promises;
const mime = require("mime");

const { createReadStream } = require("fs");

//写node代码 慢慢放弃回调方式
console.log(path.resolve("/foo", "bar/", "baz/"));
console.log(path.resolve("/"));
console.log(path.resolve(__dirname, "gg"));
console.log(path.resolve(__dirname, "/"));
console.log(path.join(__dirname, "/"));
// console.log(fs.readFile('/Users/zouyu/Desktop/node-zy/http/1.js'), '-------');
class StaticServer {
  async handleRequest(req, res) {
    //  console.log(this);
    const { pathname, query } = url.parse(req.url, true);
    //  let filePath = path.resolve(__dirname,pathname) // ----> / path.reslove遇到 /就会返回根路径
    let filePath = path.join(__dirname, pathname); //----> Users/zouyu/Desktop/node-zy/http/
    console.log(filePath, "filePath"); ///
    //需要判断你访问的是不是文件夹
    //先访问根路径 卡住了  再访问/a 也需要等待前一个执行完 会有阻塞效果 不能这么搞
    //  let sum = 0;
    //  if (pathname === '/') {
    //     for(let i = 0; i < 10000000000;i++) {
    //         sum+=i;
    //     }
    //     res.end(sum+'');
    //  }else {
    //     res.end('ok');
    //  }
    try {
      let statobj = await fs.stat(filePath);
      console.log(statobj.isFile(), "statobj.isFile()");
      if (statobj.isFile()) {
        //mime 可以根据文件后缀来识别 是什么类型的
        //读一点 写一点  流

        //    '/Users/zouyu/Desktop/node-zy/http/favicon.ico 浏览器按照心情发的 不是文件 需要捕获错误
        res.setHeader(
          "Content-Type",
          mime.getType(filePath) + ";charset=utf-8"
        );

        createReadStream(filePath).pipe(res); // res是一个可写流 可读流pipe（可写流）

        // let data = await fs.readFile(filePath); //http://localhost:3000/note.md
        // console.log(data, 'data')
        // res.end(data)
      } else {
          //文件夹
          filePath = path.join(filePath, 'index.html');
          await fs.access(filePath);//判断文件是否可以访问 异步方法不存在会报错
           res.setHeader(
            "Content-Type",
            "text/html;charset=utf-8"
          );

          createReadStream(filePath).pipe(res);
          
      }
    } catch (e) {
        this.sendError(e,req,res);
    }
  }
sendError(e,req,res) {
    res.statusCode = 404;
    res.end('NOT FOUND');
}
  start(...args) {
    const server = http.createServer(this.handleRequest.bind(this)); //解决this指向
    server.listen(...args);
  }
}
new StaticServer().start(3000, function () {
  console.log("3000----start");
});
