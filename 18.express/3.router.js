// 默认当前版本
let express = require('./express');
const PathToRegExp = require('path-to-regexp')

let app = express(); //中间件必须在真实的处理路由之前
app.get('/user/:id/:name/a',function(req,res) {
	res.end(JSON.stringify(req.params));

})
let path = '/user/:id/:name/a';
let key = [];
let reg = PathToRegExp(path) ///^\/user\/(?:([^\/]+?))\/(?:([^\/]+?))\/a\/?$/i
console.log(reg,key)
let regExp = PathToRegExp(path, keys = [], true);

console.log(keys)
/**
 * [
  { name: 'id', optional: false, offset: 7 },
  { name: 'name', optional: false, offset: 22 }
   ]
 */
console.log('/user/1/yu/a'.match(regExp)) 
/**
 * [
	'/user/1/yu/a',
	'1',
	'yu',
	index: 0,
	input: '/user/1/yu/a',
	groups: undefined
  ]
 */

/**
 * 
 * let str = '/user/:id/:name'.replace(/:([^/]+)/g,function() {
	console.log(arguments)
	console.log(arguments[1])
	return '([^/]+)'
}) //转换成正则 然后去匹配
console.log(str) //user/([^/]+)/([^/]+)/
console.log('/user/1/2'.match(new RegExp(str)))
 */

app.listen(3000,function() {
	console.log('server start 3000')
});
