const express = require('../express');
let router = express.Router(); //即充当了类 又充当了函数
router.get('/add',function(req,res,next) {
  res.end('user -- add')
})
router.get('/remove',function(req,res,next)  {
    res.end('user -- remove')
})
let router2 = express.Router(); //即充当了类 又充当了函数
router2.get('/xxx',function(req,res,next) {
  res.end('user -- add---list')
})
router.use('/a', router2) //ocalhost:3000/user/a/xxx
module.exports = router;