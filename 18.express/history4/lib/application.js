let http = require("http");
let url = require("url");
const Router = require("./router");
const methods = require("methods");
// 1.createApplication 2.application 3.routers
//创建应用 会有一个系统 路由

function Application() {
  //创建应用时 赠送一个路由系统
  //this._router = new Router(); //万一用户没有使用路由  路由只有在用到的时候才创建

}
Application.prototype.lazy_route = function() {
    if (!this._router) {
        this._router = new Router;
    }
}

methods.forEach(method => {
    Application.prototype[method] =  function(path, ...handler){
        //交给路由保存配置
        this.lazy_route();
        this._router[method](path, handler);
      };
})

Application.prototype.listen = function (...args) {
  let server = http.createServer((req, res) => {
    //有可能路由系统无法处理 就让应用自己来创建
    function done() {
      res.end(`Cannot ${req.method} ${req.url}`);
    }
    this.lazy_route();
    //让路由去处理
    this._router.handle(req, res, done);
  });
  server.listen(...args);
};
module.exports = Application;
