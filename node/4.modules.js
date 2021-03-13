//module 模块
//node中js就是一个模块
//出现原因 防止命名冲突 可以把常用的功能封装到一起
//esModule commonjs规范
//module.exports
//require
//node模块会按照后缀名查找 先找js文件 -- json
const path = require("path");
const fs = require("fs");
// console.log(__filename, __dirname);
const vm = require("vm");
function Module(id) {
  this.id = id;
  this.exports = {}; //模块的结果
}
Module.wrapper = [
  "(function(module, exports, require, __filename, __dirname) {",
  "})",
];
Module._extensions = {
  //js 需要将exports 传入给用户
  ".js"(module) {
    // console.log(module.id, '------module.id-----ext------')
    let script = fs.readFileSync(module.id, "utf8");
    // console.log(script,'script');
    let fnStr = Module.wrapper[0] + script + Module.wrapper[1];
    // console.log(fnStr, 'FNSTR---------');
    let fn = vm.runInThisContext(fnStr); //让字符串变成js代码
    // console.log(fn, 'FN-------')
    // // 第一个参数改变this指向
    fn.call(
      module.exports,
      module,
      module.exports,
      req,
      module.id,
      path.dirname(module.id)
    );
  },
  ".json"(module) {
    let script = fs.readFileSync(module.id);
    module.exports = JSON.parse(script);
  },
};
Module.resolveFileName = function (filename) {
  //判断是不是一个
  let abspath = path.resolve(__dirname, filename);
  //    console.log(abspath);
  let current = abspath;
  let flag = fs.existsSync(abspath);
  //    console.log(flag);
  if (!flag) {
    let keys = Object.keys(Module._extensions);
    for (let i = 0; i < keys.length; i++) {
      current = abspath + keys[i];
      let flag = fs.existsSync(current);
      if (flag) {
        break;
      } else {
        current = null;
      }
    }
  }
  //   console.log("current", current);
  if (!current) {
    throw new Error("文件不存在");
  }
  //   console.log("current", current);
  return current;
};
Module.prototype.load = function () {
  let ext = path.extname(this.id);

  // console.log(this,'this-------------------');
  Module._extensions[ext](this);
  //   let script = fs.readFileSync(this.id, "utf-8");
};
Module._cache = {};
function req(filename) {
  let current = Module.resolveFileName(filename);
  //   console.log(current, 'current---');
  if (Module._cache[current]) {
    return Module._cache[current].exports;
  }
  let module = new Module(current); //产生一个module
  Module._cache[current] = module;
  module.load();
  return module.exports;
}
let json = require("./b");
json = require("./b");

// console.log('-------------')
console.log(json, "json");
//先找文件 找不到找文件夹
//第三方模块 node_modules 文件夹 index.js 找不到会向上级查找
//package.json 会先找main 对应的文件
