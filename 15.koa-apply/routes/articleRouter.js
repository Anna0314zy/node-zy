//添加文章 文章查询
let Router = require('koa-router');
const ArticalController = require('../controller/articalController')
//article/...
const router = new Router({prefix:'/article'});
let articleCtrl = new ArticalController();
router.get('/add',articleCtrl.add)
router.get('/list',articleCtrl.list)
module.exports = router;