const url = require('url')
function Router() {
  this._router = [];
}
//1.创建route 和 layer
Router.prototype.get =function(path,handler){
    this._router.push({
        path,
        method:'get',
        handler
    })
  }
  Router.prototype.handle = function(req,res,done) {
    let { pathname } = url.parse(req.url);
    for (let i = 0; i < this._router.length; i++) {
      let { path, method, handler } = this._router[i];
      if (path === pathname && method == req.method.toLocaleLowerCase()) {
        return handler(req, res); //找到对应的参数
      }
    }
   done();
  }
module.exports = Router;
