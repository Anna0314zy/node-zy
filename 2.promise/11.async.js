let fs = require("fs").promises;

async function read() {
    let name = await fs.readFile("./a.text", "utf8");
    let age = await fs.readFile(name, "utf8");
    return age;
  }
  //async 方法执行后返回的是一个promise
  read().then(data => {
      console.log(data);
  })