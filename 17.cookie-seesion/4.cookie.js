const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const crypto = require('crypto');
//koa 是专门用一个字段来描述签名
// crypto.createHmac('sha1','zfpx').update('visit-9').digest('base64')
app.keys = ["zfpx"];
const session = {};//用来记录映射关系 如果刷新会丢失数据 服务器崩溃 - 可用redis 或者mongo
const CardName = 'connect.sid';//卡的名字
router.get("/visit", (ctx, next) => {

    let cardId = ctx.cookies.get(CardName);
    if (cardId && session[cardId]) {
        session[cardId].mny -= 10;
        ctx.body = `您有${session[cardId].mny}元充值卡`
    }else {
        let cardId = Math.random()+Date.now().toString();
        ctx.cookies.set(CardName,cardId);
        session[cardId] = {mny:100};
        ctx.body = '您有100元充值卡'
    }
//   let visit = ctx.cookies.get("visit", { signed: true });
//   if (visit) {
//     visit++;
//   } else {
//     visit = 1;
//   }
//   ctx.cookies.set("visit", visit, { signed: true });
//   ctx.set("Content-Type", "text/heml;charset=utf-8");
//   ctx.body = `当前用户第${visit}次访问`;
});
app.use(router.routes());
app.listen(3000);
