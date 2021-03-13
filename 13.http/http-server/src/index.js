const http = require("http");
const path = require("path");
const url = require("url");
const fs = require("fs").promises;
const { createReadStream, createWriteStream, readFileSync } = require("fs");
//模板引擎
const ejs = require("ejs");
const mime = require("mime");
const  crypto = require('crypto')
const chalk = require("chalk");

class Server {
  constructor(options) {
    this.port = options.port;
    this.directory = options.directory;
    this.template = readFileSync(
      path.resolve(__dirname, "render.html"),
      "utf8"
    );
  }
  async handleRequest(req, res) {
    let { pathname, query } = url.parse(req.url);
    pathname = decodeURIComponent(pathname); //可能路径含有中文
    let filepath = path.join(this.directory, pathname);
    console.log(filepath, "filepath");
    try {
      let statobj = await fs.stat(filepath);
      if (statobj.isFile()) {
        this.sendFile(req, res, statobj, filepath);
      } else {
        //需要列出文件夹中的内容
        let dirs = await fs.readdir(filepath); // fs-extra 模块 推荐用这个

        //文件访问的路径 采用绝对路径 尽量不要用 ./ ../ 路径
        dirs = dirs.map((item) => ({
          dir: item,
          href: path.join(pathname, item),
        }));

        let result = await ejs.render(this.template, { dirs }, { async: true });
        // console.log(result,'result')
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        res.end(result);
      }
    } catch (e) {
        console.log(e, 'error------')
      this.sendError(e, req, res);
    }
  }
  cache(req, res, statobj, filepath) {
    //场景 public a.html 引用了a/1.js 不断刷新a.html 可以看见1.js并没有每次都请求浏览器
    //设置缓存  默认缓存10s 10s内不在像服务器发起请求  首页不会强制缓存 引用的资源可以强制缓存
    res.setHeader("Expires", new Date(Date.now() + 10 * 1000).toGMTString());
    //no-catch 表示每次都像服务器发起请求  有缓存的
    //no-store 浏览器不缓存
    //  res.setHeader('Cache-Control', 'no-cache'); //http1.1 a.html引用的文件 1.js 第一次是200  后面一直是304
    res.setHeader("Cache-Control", "max-age=10"); //缓存内容将在10秒后失效 http1.1 a.html引用的文件 1.js 10秒内一直是200 10秒后开始对比 走304

    let etag = crypto.createHash('md5').update(readFileSync(filepath)).digest('base64')
    res.setHeader("Etag", etag); 
    console.log(req.url, "------");
    //过了10s 文件还是没变 可以不用返回文件 告诉浏览器 缓存就是最新的
    //协商缓存 商量一个 是否需要给最新的 如果不需要返回内容 直接给304状态吗 表示找缓存即可
    //默认先走强制缓存 10s内不会发送请求到服务器中采用浏览器缓存 但是10s后再次发送请求 后端进行对比
    // 1）文件没有变化 直接返回304即可 浏览器会从缓存中查找文件 之后的10s中还是会走缓存
    //  2）文件变化了 返回最新的 之后的10s还是会走缓存 。。。。
    //看文件是否变化
    //1.根据修改时间 来判断文件是否修改了  304服务端设置的

    // If-Modified-Since: Sun, 24 Jan 2021 12:50:22 GMT
    let IfModifiedSince = req.headers['if-modified-since'];
    let IfNoneMatch = req.headers['if-none-match'];//node 请求头都要小写
    let ctime = statobj.ctime.toGMTString();
    //服务器设置的
    res.setHeader('Last-Modified', statobj.ctime.toGMTString()); //changename 修改时间 每次请求都会带着这个
    console.log(IfModifiedSince, IfModifiedSince != ctime, 'IfModifiedSince')
    if (IfModifiedSince != ctime) { //缺陷 如果文件没变 修改时间改了 2）监控的时间是秒级的 服务端容易 监控不到 
       return false;
    }
    if (IfNoneMatch != etag) { //可以用开头 加上总字节大小生产etag
        return false;
    }

    //采用指纹 Etag - 根据文件产生一个唯一的表示 md5 --> 解决上面的 缺陷
    return true;
  }
  sendFile(req, res, statobj, filepath) {
    if (this.cache(req, res, statobj, filepath)) {
        console.log('文件走缓存----')
      res.statusCode = 304; //协商缓存是包含首次访问的资源的
      return res.end();
    }
    res.setHeader("Content-Type", mime.getType(filepath) + ";charset=utf-8");
    createReadStream(filepath).pipe(res);
  }
  sendError(e, req, res) {
    res.statusCode = 404;
    res.end("NOT FOUND");
  }
  start() {
    const server = http.createServer(this.handleRequest.bind(this)); //解决this指向
    server.listen(this.port, () => {
      console.log(
        `${chalk.yellow("Starting up zf-server:")}  ./${path.relative(
          process.cwd(),
          this.directory
        )}`
      );
      console.log(`http:localhost:${chalk.green(this.port)}`);
    });
  }
}
module.exports = Server;
