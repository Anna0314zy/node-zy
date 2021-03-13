const url = require("url");
const Layer = require("./layer");
const Route = require("./route");
const methods = require("methods");
function Router() {
  this.stack = [];
}
//1.创建route 和 Layer layer上要有一个route属性
Router.prototype.route = function (path) {
  let route = new Route();
  //每次调用get方法时 都产生一个layer 路径对应route的dispatch方法
  let layer = new Layer(path, route.dispatch.bind(route));
  layer.route = route;
  this.stack.push(layer);
  return route;
};
methods.forEach(method => {
//发起请求 创建route 和 Layer layer上要有一个route属性
Router.prototype[method] = function (path, handlers) {
  let route = this.route(path);
  route[method](handlers); //传入的handler存起来
};
})
Router.prototype.use = function(path,handler) {

  if (typeof path === 'function') {
    handler = path;
    path = '/';//如果只传一个参数
  }
  let layer = new Layer(path,handler);
  layer.route = undefined;//提示 中间件没有route
  this.stack.push(layer);
}
// app.get('/',function(req,res,next){
// 	console.log(2222);
// 	next()
// }); //目的是去处理这里的回调函数
//请求到来的时候会触发此方法
Router.prototype.handle = function (req, res, done) {
  let {pathname} = url.parse(req.url);
  // let requestMethod = req.method.toLowerCase();
    let idx = 0;
    //先遍历外层的
    let next = (err) => {
      if(this.stack.length === idx) return done(); // 匹配不到调用not found
        let layer = this.stack[idx++];
       if (err) {
         if (!layer.route) { //找到错误的中间件
           //中间件
           layer.handle_error(err,req,res,next)
         }else {
            next(err);
         }
        return;
       }
        // console.log(layer.match(pathname),'layer.match(pathname)')
        if(layer.match(pathname)){ // 如果路径匹配到了 调用route的dispatch方法
          req.params = layer.params;
            //有可能是中间件
            if (layer.route) {
              if (layer.route.match_methods(req.method.toLowerCase())){ //加速匹配
                layer.handler_request(req,res,next); //next 就是 route里面的dispacth 里面处理不了了 调用下一个
              }else {
                next();
              }
            }else {
               //如果参数是4个 错误中间件
               if (layer.handler.length !== 4) {
                layer.handler_request(req,res,next); //中间件 不匹配方法 直接执行回调函数
               }else {
                 next();
               }
             
            }     
        }else{
            next(); // 匹配不到找下一层
        }
    }
    next();
};
module.exports = Router;
