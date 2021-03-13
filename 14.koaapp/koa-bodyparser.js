const querystring = require("querystring");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
// console.log(querystring.parse('a==1&&b==2','&&','==')); // { a: '1', b: '2' }
function body(ctx, uploadDir) {
  return new Promise((resolve, reject) => {
    let arr = [];
    ctx.req.on("data", function (chunk) {
      arr.push(chunk);
    });
    ctx.req.on("end", function () {
      //表单格式
      //json格式
      //图片格式
      // Content-Type: application/x-www-form-urlencoded
      let type = ctx.get("content-type");
      let data = Buffer.concat(arr); //用户传递的数据
      if (type == "application/x-www-form-urlencoded") {
        //form data格式  a = 1& b=1
        resolve(querystring.parse(data.toString())); //将字符串转换成对象
      } else if (type == "application/json") {
        resolve(JSON.parse(data.toString()));
      } else if (type == "text/plain") {
        resolve(data.toString());
      } else if (type.startsWith("multipart/form-data")) {
        //文件
        //给我当前 multipart/form-data; boundary=----WebKitFormBoundarysto5Krh0ABlBbH34
        // resolve(data.toString());
        // data //二进制 分割成多个行
        console.log(data.toString());
        /**
         * ------WebKitFormBoundaryb93529ZILRoVAtAN
Content-Disposition: form-data; name="username"

oo
------WebKitFormBoundaryb93529ZILRoVAtAN
Content-Disposition: form-data; name="password"

88
------WebKitFormBoundaryb93529ZILRoVAtAN
Content-Disposition: form-data; name="avatar"; filename="name.txt"
Content-Type: text/plain

ggggg

dddd
pp
------WebKitFormBoundaryb93529ZILRoVAtAN--
         */
        let bondary = "--" + type.split("=")[1]; //分割符是4位 但是后台读取buffer的是6位
        let lines = data.split(bondary);
        lines = lines.slice(1, -1);
        let resultObj = {};
        lines.forEach((line) => {
          let [head, body] = line.split("\r\n\r\n"); //规范就有2 个换行符
          if (head) {
            let key = head.toString().match(/name="(.+?)"/)[1]; // ?尽可能少喜欢
            if (!head.includes("filename")) {
              //文件
              resultObj[key] = body.slice(0, -2).toString(); //会有两个换行符
            } else {
              //文件 上传
              let originalName = head.toString().match(/filename="(.+?)"/)[1]; // ?尽可能少喜欢
              console.log(originalName, "originalName-------");
              let filename = uuid.v4(); //产生唯一的一个文件名

              //    获取文件内容

              let content = line.slice(head.length + 4, -2); //2个换行符 获取中间的内容
              fs.writeFileSync(path.join(uploadDir, filename), content);
              resultObj[key] = resultObj[key] || [];
              resultObj[key].push({
                size: content.length,
                name: originalName,
                filename,
              });
            }
          }
        });
        resolve(resultObj);
      } else {
        resolve();
      }
    });

    //   resolve();
  });
}

module.exports = function bodyParser(...args) {
  return async (ctx, next) => {
    ctx.request.body = await body(ctx, ...args);
    return next();
  };
};
// 111&111&666 Buffer.indexOf
Buffer.prototype.split = function (bondary) {
  let arr = [];
  let offset = 0;
  let currentPosition = 0;
  //找不到就不找了
  while (-1 != (currentPosition = this.indexOf(bondary, offset))) {
    arr.push(this.slice(offset, currentPosition));
    offset = currentPosition + bondary.length;
  }
  arr.push(this.slice(offset));
  return arr;
};
console.log(Buffer.from("111&1111&666").split("&"));
