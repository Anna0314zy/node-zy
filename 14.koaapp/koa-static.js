const path = require("path");
const { createReadStream } = require("fs");
const fs = require("fs").promises;
const mime = require('mime')
module.exports = function koaStatic(dirname) {
  return async (ctx, next) => {
    let filepath = path.join(dirname, ctx.path);
    console.log(filepath, 'filepath');
    try {
      let statobj = await fs.stat(filepath);
      console.log(statobj.isFile(),'statobj.isFile()')
      if (statobj.isFile()) {
        ctx.set('Content-Type', mime.getType(filepath) + ';charset=utf-8');
        ctx.body = createReadStream(filepath)
        // return next()
      } else {
        return next();
      }
    } catch (error) {
      return next();
    }
  };
};
