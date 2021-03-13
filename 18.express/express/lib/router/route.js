let Layer = require("./layer");
const methods = require("methods");
function Route() {
  this.stack = [];
  this.methods ={};
}
methods.forEach((method) => {
  Route.prototype[method] = function (handlers) {
    //如果是通过应用实例化路由系统 这里是个数组 如果是直接调用router的方法肯定是个函数
    if (!Array.isArray(handlers)) handlers = [handlers]
    handlers.forEach((handler) => {
      let layer = new Layer("", handler);
      layer.method = method;
      this.methods[method] = true; //get true
      this.stack.push(layer);
    });
  };
});
Route.prototype.match_methods = function(method) {
  return this.methods[method]
}
Route.prototype.dispatch = function (req, res, out) {
  //循环当前route中的layer
  let idx = 0;
  let next = (err) => {
    if (err) return out(err);
    if (this.stack.length === idx) return out();
    console.log('ok----') //前端模拟4个post / 但是get / 也会走这里 没必要
    let layer = this.stack[idx++]; //如果路径匹配上了 而method 没有匹配上 这里会走 性能低
    //匹配方法  可以直接写判断 因为method 属性是自定义的
    if (layer.method === req.method.toLowerCase()) {
      layer.handler_request(req, res, next);
    } else {
      next();
    }
  };
  next();
};
module.exports = Route;
