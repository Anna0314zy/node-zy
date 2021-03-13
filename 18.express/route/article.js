const express = require('../express');
let router = express.Router(); //即充当了类 又充当了函数
router.get('/add',function(req,res,next) {
  res.end('article -- add')
})
router.get('/remove',function(req,res,next)  {
    res.end('article -- remove')
})
module.exports = router;