const express = require('./express');
const app = express();
const article = require('./route/article')
const user = require('./route/user')
// app.get('/',function(req,res,next){
//     res.end('ok----')
// })
app.use('/article', article)
app.use('/user', user)
app.listen(3000)