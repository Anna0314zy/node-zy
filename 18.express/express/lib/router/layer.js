const PathToRegExp = require('path-to-regexp')

function Layer(path,handler){
    this.path = path;
    this.handler = handler;
    // /user/:id/:name  [id,name]
    this.regExp = PathToRegExp(this.path, this.keys = [], true);
}
Layer.prototype.match = function(pathname) { //当请求路径到来时pathname 用户配置的是带:name/:id
    //匹配路径时  需要看一下是路由还是中间件 中间件需要匹配 是否一他开头
    //  console.log(this.path, pathname);
    if (this.path === pathname) {
        return true
    }
    if (this.keys.length > 0) {   //如果是路由 我就看一下当前请求的路径 是否能和转换出的正则进行匹配
        let matches = pathname.match(this.regExp);
        if (matches) {
            let values = matches.slice(1);
            // console.log(values, this.keys);
            this.params = {};
            this.keys.forEach((item,idx) => {
                this.params[item.name] = values[idx];
            })
            return true
        }
    }



    if (!this.route) {
        if (this.path == '/') {
            return true;
        }
        return pathname.startsWith(this.path + '/')
    }
    return false
}
Layer.prototype.handle_error = function(err,req,res,next) {
    if (this.handler.length ===4) {
        return this.handler(err,req,res,next)
    }
    next(err);//不是错误处理中间件 向下执行

}
Layer.prototype.handler_request = function(req,res,next) {
    this.handler(req,res,next)
}
module.exports = Layer;