let Layer = require("./layer");
const methods = require("methods");
function Route() {
  this.stack = [];
  this.methods ={};
}
methods.forEach((method) => {
  Route.prototype[method] = function (handlers) {
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
  let next = () => {
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
