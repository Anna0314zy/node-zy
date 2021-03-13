const fs = require("fs");
const bluebird = require("bluebird");
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, function (err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  };
}
function promisifyAll(target) {
  //Object.keys
  Reflect.ownKeys(target).forEach((key) => {
    if (typeof target[key] === "function") {
      target[key + "Async"] = promisify(target[key]);
    }
  });
  return target;
}

// let obj = bluebird.promisifyAll(fs);
let obj = promisifyAll(fs);

const readFile = promisify(fs.readFile);
obj.readFileAsync("./a.text", "utf8").then((data) => {
  console.log(data);
});
