const http = require('http');
const querystring = require('querystring');
const crypto = require('crypto')
function signed(value) {
    //加盐算法 放入不同的秘钥 产生不同的结果 不可逆的 盐值(zfpx -秘钥)
    //base64 传输的过程中 + = 都转换成空字符串
    return crypto.createHmac('sha256','zfpx').update(value).digest('base64')
}

const server = http.createServer((req,res) => {
    let arr = [];
   res.setCookie = function(key,value,options = {}) {
       let args = [];
    if (options.maxAge) {
       args.push(`max-age=${options.maxAge}`)
    }
    if (options.domain) {
        args.push(`domain=${options.domain}`)
    }
    if (options.path) {
        args.push(`path=${options.path}`)
    }
    if (options.httpOnly) {
        args.push(`httpOnly=${options.httpOnly}`)
    }
    if (options.signed) {
        value= value + '.' + signed(value);
    }
        
         arr.push(`${key}=${value}; ${args.join('; ')}`)
         console.log(arr, 'arr');
         res.setHeader('Set-Cookie',arr);
   }
  //防止用户随意篡改
   req.getCookie = function(key,options) {
       let result = querystring.parse(req.headers.cookie,'; ','=');
       if (options.signed) { //要验证签名
        let [value,s]  = (result[key] || '').split('.');
        if (s == signed(value)) {
          return value;
        }else {
            return undefined;
        }

       }
       return value

   }

   //当用户访问 /read 表示读取cookie 
   if (req.url === '/read') {
    // Cookie:name=zf; age=10 前端设置的cookie 发请求的时候也会带上
//    let data =  querystring.parse(req.headers.cookie,'; ','='); //分隔符 
//    res.end(JSON.stringify(data));
   //获取cookie
   let ret = req.getCookie('name',{
       signed:true 
   })
   res.end(ret);
   }else if (req.url === '/write') {
       //max-age(多少秒失效) /Exipres绝对时间 
       //domamin 针对哪个域名生效 (二级域名) a.zhufeng.com b.zhufeng.com   .zhufeng.com  对两个域名都有效
    //    res.setHeader('Set-Cookie', ['name=zf; max-age=10; domain=.zf.cn', 'age=10']); // 注意有空格
    // res.setHeader('Set-Cookie',['name=zf; max-age=10; domain=.zf.cn', 'age=10; ']);

       res.setCookie('name','zf',{
           maxAge:100,
           path: '/', //限制在某个路径下
        //    path: '/write',//在/write路径开头才能访问
        //    domain:'.zf.cn', //不加domain 默认是当前域名 减少cookie的访问
           httpOnly: true, //只有服务端才能修改cookie 浏览器读不了 但是可以手动改 相对安全些
           signed: true
       })
       res.setCookie('age',10)
       res.end('ok---');
   }
   
   // /write 的时候写入cookie
});
server.listen(3000)