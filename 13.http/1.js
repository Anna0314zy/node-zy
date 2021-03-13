const http = require('http');
const url = require('url');
//uri (uniform ) url urn
// let l = url.parse('http;//username:password@localhost:3000/resource?a=1&b=4#hash',true)
// console.log(l)
/**
 * protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: '#hash',
  search: '?a=1',
  query: 'a=1',
  pathname: 'http;//username:password@localhost:3000/resource',
  path: 'http;//username:password@localhost:3000/resource?a=1',
  href: 'http;//username:password@localhost:3000/resource?a=1#hash'
 * 
 */

let server = http.createServer(function(req,res){
//   console.log('4')
  console.log(req.method);
  console.log(req.url); // /后面的 #前面的
  console.log(req.httpVversion);
  console.log(req.headers); //所有的请求头都是小写的
  console.log(url.parse(req.url));
  let {pathname,query} = url.parse(req.url,true); //true把查询参数变成对象
  console.log(pathname,query)
  console.log(req.headers);
  let arr = [];
  //如果流中的数据为空 内部会调用push(null) 只要调用了push 一定会触发end
  req.on('data', function(chunk) {
    arr.push(chunk)
  })
  req.on('end', function() { //如果没有数据也会触发
      console.log(Buffer.concat(arr));
  })
 //客户端获取 响应行 响应头 响应体顺序不能发生变化
 //res是一个可写流 write end
 //希望服务器每一秒都给客户端最新的一个价格
res.statusCode = 600;
res.statusMessage = 'no status';
res.setHeader('a',1)
res.write('ok---');
res.end();


})
// server.on('request', function(req, res) {
//     console.log('2')
// })
let port = 4000;
server.listen(port, function() {
    console.log('start'+port)
})
server.on('error',function(err) {
    // i
    // console.log(err);
    if (err && err.errno === 'EADDRINUSE') {
        server.listen(++port)
    }
})
//curl -v 显示详细信息
//curl -X 指定方法
//curl -d 指定数据