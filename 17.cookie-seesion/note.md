## cookie session localstorage seesionstorage 的区别
- localstorage seesionstorage 只能在在本地访问 --不能超过5M(不会在请求中携带 不能跨越)
- cookie http无协议 用来识别请求的 客户端和服务端都可以使用
cookie 跨域默认不能携带cookie cookie 存放在客户端 csrf 不安全
（合理设置cookie 否则每次请求都会携带cookie 4k）
session 基于cookie session只是一个对象存在服务端中 通过一个标识可以找到对应的信息 标识就是通过cookie来发送的
 session存在服务端  客户端只存手机号 服务端存放着敏感信息
 - jwt