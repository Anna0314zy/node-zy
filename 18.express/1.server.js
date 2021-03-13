// 默认当前版本
let express = require('./express');

let app = express();
// app.route('/').get(function(){}).post().delete()
// 最基本的模型
//每个路由都是一个layer 每个layer (path,dispatch)组成
//每个layer 都有一个route这个route存放着真实的回调 layer 这里没有路径 但是要给每个人添加一个方法 get post （dispatch）
app.post('/',function(req,res,next){ //可以在函数中增加一些中间件 -- 一个功能拆分成若干个小功能
	console.log('1')
	next();
},function(req,res,next){
	console.log('11')
	next();
},function(req,res,next){
	console.log('122')
	next();
	res.end('post-end')
})
app.get('/',function(req,res,next){
	console.log(2222);

	res.end('get /')
	// next()
});
app.post('/user',function(req,res) {
	res.end('post')
   })
// app.all('*',function(req,res){
// 	res.end('all');
// });
app.listen(3000,function() {
	console.log('server start 3000')
});
