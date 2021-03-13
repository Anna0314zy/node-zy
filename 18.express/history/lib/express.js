let http = require("http");
let url = require("url");
let routers = [ // 404路由
  {
    path: "*",
    method: "*",
    handler(req, res) {
      res.end(`Cannot ${req.method} ${req.url}`);
    }
  }
];
function createApplication() {
  return {
    get(path, handler) {
      routers.push({
        path,
        method: "get",
        handler
      });
    },
    listen(...args) {
      let server = http.createServer((req, res) => {
        let { pathname } = url.parse(req.url);
        for (let i = 1; i < routers.length; i++) {
          let { path, method, handler } = routers[i];
          if (path === pathname && method == req.method.toLocaleLowerCase()) {
            return handler(req, res); //找到对应的参数
          }
        }
        return routers[0].handler(req, res);
      });
      server.listen(...args);
      // server.listen(...arguments);
    }
  };
}
module.exports = createApplication;