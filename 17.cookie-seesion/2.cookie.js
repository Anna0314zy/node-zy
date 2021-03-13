const http = require('http');
const querystring = require('querystring');
const crypto = require('crypto')
function signed(value) {
    //加盐算法 放入不同的秘钥 产生不同的结果 不可逆的 盐值(zfpx -秘钥)
    //base64 传输的过程中 + = 都转换成空字符串  value不能是数字
    // 1.Ra0vLMhEw1Kry9JuZM1EQHw4C9ceglV+azxgqPTS+AE=
    // 1.Ra0vLMhEw1Kry9JuZM1EQHw4C9ceglV+azxgqPTS+AE=;
    //在传输base64时需要转换 + = /  /转化成_   + 变成 -   =变成空  （= 是补位的）
    return crypto.createHmac('sha256','zfpx').update(value+'').digest('base64').replace(/\/\|\=|\+/g, '');
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
        console.log(s,signed(value)) //获取头的过程中’/\=+‘ 会丢失
        // Ra0vLMhEw1Kry9JuZM1EQHw4C9ceglV azxgqPTS AE= 
        //Ra0vLMhEw1Kry9JuZM1EQHw4C9ceglV+azxgqPTS+AE=
        if (s == signed(value)) {
          return value;
        }else {
            return undefined;
        }

       }
       return value

   }
   //每次访问服务器 统计客户端 访问的次数

   if(req.url === '/visit') {
       let visit = req.getCookie('visit',{signed:true});
       if (visit) {
           visit++;
       }else {
        visit=1;
       }
       res.setCookie('visit',visit,{signed:true})
       res.setHeader('Content-Type','text/heml;charset=utf-8')
       res.end(`当前用户第${visit}次访问`)

   }

  
});
server.listen(3000)