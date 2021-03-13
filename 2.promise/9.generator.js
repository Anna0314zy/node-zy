//我们希望写的
//koa1.0
//生成的是迭代器

function gen$(context) {
  while (true) {
    switch (context.prev = context.next) {
      case 0:
        context.next = 1;
        return 1;
      case 1:
        context.next = 2;
        return 2;
      case 2:
        context.next = 3;
        return 3;
      case 3:
       context.stop();
        return 100;
    }
  }
}
let gen = function () {
  const context = {
    prev: 0, //当前运行的
    next: 0, //下一次运行的
    done: false, //是否完成运行
    stop() {
      this.done = true;
    },
  };
  return {
    next() {
      return {
        value: gen$(context), //将上下文传入
        done: context.done,
      };
    },
  };
};
// function* gen() {
//   //根据指针向下执行 switch -case实现
//   yield 1;
//   yield 2;
//   yield 3;
// }
let it = gen();
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
