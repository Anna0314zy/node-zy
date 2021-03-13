let Router = require('koa-router');
const UserController = require('../controller/userController')
//article/...
const router = new Router({prefix:'/user'});
let userController = new UserController();
router.get('/add',userController.add)
router.get('/list',userController.list)
module.exports = router;