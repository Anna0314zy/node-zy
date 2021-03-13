// console.log('my koa');
const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");
const EventEmitter = require("events");
const Stream = require("stream");
class Application extends EventEmitter {
  constructor() {
    super();
    // 我们不能直接把resuqest赋值给context 如果其中一个应该改变了reques 和 reponse
    this.context = Object.create(context); //此方法可以继承 继承原本的属性 用户扩展到新的创建的对象 不会影响原来的对象
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.middlewares = [];
  }
  use(fn) {
    this.middlewares.push(fn);
    // this.fn = fn;
  }
  //多次请求 也需要用全新的上下问 保证每次请求之间没有干扰
  createContext(req, res) {
    let ctx = Object.create(this.context);
    let request = Object.create(this.request);
    let response = Object.create(this.response);
    // request 和 response 是koa的
    ctx.request = request;
    ctx.response = response;
    ctx.request.req = ctx.req = req;
    ctx.response.res = ctx.res = res;

    return ctx;
  }
  componse(ctx) {
    //需要将多个函数组合 第一个完成后再调用下一个 co 异步迭代
    let index = -1; //防止应用这多次调用next
    const dispatch = (i) => {
      //如果一个use没有
      if (index === i) return Promise.reject('next() call multiple')
      if (i === this.middlewares.length) return Promise.resolve();
      index = i;
      let middleware = this.middlewares[i];
      try {
        return Promise.resolve(middleware(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    };
    return dispatch(0);
  }
  handleReauest(req, res) {
    let ctx = this.createContext(req, res);
    res.statusCode = 404;
    // this.fn(ctx);
    this.componse(ctx)
      .then(() => {
        let body = ctx.body;
        if (typeof body === "string" || Buffer.isBuffer(body)) {
          res.end(ctx.body);
        } else if (body instanceof Stream) {
          body.pipe(res);
        } else {
          res.end("NOT FOUND");
        }
      })
      .catch((err) => {
        this.emit("error", err);
      }); //返回的是一个promsie
      this.on('error', () => {
        res.statusCode = 500;
        res.end('internal Error')
      })
  }
  listen(...args) {
    let server = http.createServer(this.handleReauest.bind(this));
    server.listen(...args);
  }
}
module.exports = Application;
