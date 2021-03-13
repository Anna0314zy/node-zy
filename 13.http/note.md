
## 方法
- http中的方法  Restful风格 get post添加 put修改 delete

- 强求路径 来区分对资源的操作 /addUser /removeUser /getUser
- Restful风格 可以通过方法来区分做什么操作 get /user post /user 
- 跨域请求 options 预检请求 跨域时才会携带（简单请求不会发送options请求 简单的有get post 如果用户添加了自定义信息也算复杂请求）
  复杂请求并且跨域 就会发生预检 cookie不允许跨域 --- 预检不通过 不会发送后续的内容

>http请求发出去后等待服务器返回结果，服务端不能主动推送消息
## 状态码 服务端跟浏览器商量好的
- 1xx websocket
- 2xx 200成功 204响应体为空 206(范围请求)
- 3xx 304（缓存）-服务端配置的 协商缓存 301永久重定向(访问百度 直接重定向到谷歌 域名迁移) 302临时重定向（pc 移动端的域名 发生跳转） 307重定向
- 4xx 请求出错了 参数有问题 401没权限 403登录了权限不够 404找不到 405方法不允许（get请求 请求发的post）
- 5xx 服务端错误 502 503 504

## 通信 规则
- 客户端访问服务器 postman curl (命令行  curl -v http://www.baidu.com)
 http2 可以复用通道 静态资源可以用 不限制