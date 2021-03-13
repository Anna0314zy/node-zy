//json web token 令牌
let Koa = require('koa');
let Router = require('koa-router');
let bodyparser = require('koa-bodyparser');
const crypto = require('crypto')
let jwt = require('jwt-simple'); //简单的 jsonwebtoken
let router = new Router()
let app = new Koa();
app.use(bodyparser())
let secret = 'zfpx';
let jwt2 = {
    sign(content,secret){
        let r = crypto.createHmac('sha256',secret).update(content).digest('base64');
        return this.base64url(r)
    },
    base64url(str){
        return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    },
    toBase64(content){
        return this.base64url(Buffer.from(JSON.stringify(content)).toString('base64'))
    },
    encode(payload,secret){
        let header = this.toBase64({ typ: 'JWT', alg: 'HS256' });
        let content = this.toBase64(payload);
        let sign = this.sign([header,content].join('.'),secret);
        return  [header,content,sign].join('.')
    },
    base64urlUnescape(str) {
        str += new Array(5 - str.length % 4).join('=');
        return str.replace(/\-/g, '+').replace(/_/g, '/');
    },
    //反向 解码
    decode(token,secret){
        let [header,content,sign] = token.split('.');
        let newSign = this.sign([header,content].join('.'),secret);
        if(sign === newSign){
            return JSON.parse(Buffer.from(this.base64urlUnescape(content),'base64').toString());
        }else{
            throw new Error('被篡改')
        }
    }
}
// 验证是否登陆
router.post('/login',async(ctx)=>{ 
    //访问login时 我就给你生成一个令牌 返还给你
    let {username,password} = ctx.request.body;
    console.log(username, '--------')
    username = username || 'admin';
    //eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwaXJlcyI6IjEwMCJ9.n_npoDGiZEXqQ7lp71_m_LIv0fjfbEqGZYV3Hu5LcxI
    //eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwaXJlcyI6IjEwMCJ9.n_npoDGiZEXqQ7lp71_m_LIv0fjfbEqGZYV3Hu5LcxI
    let token =  jwt.encode({
        username,
        expires: '100'
        // expires:new Date(Date.now()+20*1000*1000).toGMTString()
       },secret);
       ctx.body = {
            code:200,
            username,
            token,
       }
});
//验证是否登录
router.get('/validate',async ctx => {
    let Authorization = ctx.get('authorization')
    // Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwaXJlcyI6IjEwMCJ9.n_npoDGiZEXqQ7lp71_m_LIv0fjfbEqGZYV3Hu5LcxI
    let [,token] = Authorization.split(' ');
    if(token){
        try{
            let r = jwt2.decode(token,secret);
            //判断是不是过期了
            ctx.body = {
                code:200,
                username:r,
                token
            }
        }catch(e){
            ctx.body = {
                code:401,
                data:'没有登陆'
            }
        }
    }else{
        ctx.body = {
            code:401,
            data:'没有登陆'
        }
    }
})
app.use(router.routes())
app.listen(3000)