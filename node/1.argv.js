// console.log(this === module.exports);
(function() {
    // console.log(Object.keys(this))
})();  
//process 进程
// console.log(process, process.platform) //mac - darwin  windows -- win32
//执行node 类似 webpack xxx --config 
//只能通过命令 + 文件名 执行 process.argv.slice(2)
// console.log(process.argv.slice(2), 'argv')
// [ '--port', '3000', '--config', 'xxx' ] argv
/**let config = process.argv.slice(2).reduce((memo, current, index, array) => {
  if (current.includes('--')) {
      memo[current.slice(2)] = array[index + 1];
  }
  return memo;
},{});
console.log(config)  {port:3000, config:  xxx}
*/
//commander 命令行的管家
const program = require('commander');
const chalk = require('chalk');
program.naome('zf');
program.usage('[options]')
//这个要写在上面 才有效果
program //配置命令
.command('create')
.alias('c')
.description('create project')
.action(() => {
    console.log('create project')
})
//'set port描述文字'
program
.option('-p, --port <val>', 'set port')
.version('1.0.0')

// console.log(program);
program.on('--help', () => {
  console.log('Examples')
  console.log('  node 1.js')
  console.log('  node 1.js create' + '  ' + chalk.green('project'))
})
.parse(process.argv) //parse一定要放到最后
console.log(program.prot)
// https://www.npmjs.com/package/chalk 粉笔工具

// argv: [ '/usr/local/bin/node', '/Users/zouyu/Desktop/node/1.js' ],
//argv 代表用户传递的参数 默认前2个参数 没有实际意义

//Buffer 缓存区  我们node 内存中的数据都是二进制 -- 16进制（短一点）
/** 
[
    'global',
    'clearInterval',
    'clearTimeout',
    'setInterval',
    'setTimeout',
    'queueMicrotask',
    'clearImmediate',
    'setImmediate' 宏任务 ie
  ]
  */
//golbal 全局属性 require __dirname __filename