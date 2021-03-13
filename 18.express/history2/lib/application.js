let http = require("http");
let url = require("url");
const Router = require('./router')
// 1.createApplication 2.application 3.routers
//创建应用 会有一个系统 路由


function Application () {
    //创建应用时 赠送一个路由系统
    this._router = new Router();

}
Application.prototype.get = function(path, ...handlers) {
    //交给路由保存配置
    this._router.get(path, ...handlers)
    // this._router.get({
    //   path,
    //   method: "get",
    //   handler
    // });
  }
  Application.prototype.listen = function(...args) {
    let server = http.createServer((req, res) => {
        //有可能路由系统无法处理 就让应用自己来创建
        function done() {
            res.end(`Cannot ${req.method} ${req.url}`);
        }
        this._router.handle(req,res,done)
        
      });
      server.listen(...args);
  }
  module.exports = Application;