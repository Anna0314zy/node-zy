let ejs = require('ejs');
let fs = require('fs');
let templateStr = fs.readFileSync('./index.html', 'utf8');
//把<%%>语法替换掉，把我们需要的内容用str拼接
//实现一个with(obj)
//new Function 让字符串变函数
function render(templateStr, obj) {
    let start = `let str\r\n`;
    start += `with(obj){\r\n`
    start += 'str=`';
  //匹配<%%>，替换<%成反引号，替换%>成templ+=`,构成模板字符串
  //<%=%>替换成${xxx}
  templateStr = templateStr.replace(/<%=([\s\S]*?)%>/g, function () {
    return '${' + arguments[1] + '}';
  })
    templateStr = templateStr.replace(/<%([\s\S]+?)%>/g, function() {
       
        return '`\r\n' + arguments[1] + '\r\nstr+=`'
    });


    let tail = '`\r\n}\r\n return str';
    let fnStr = new Function('obj', start + templateStr + tail)
    // console.log(fnStr.toString())
    return fnStr(obj)
   
}
templateStr = render(templateStr, {arr:[1,2,3]});
console.log(templateStr)