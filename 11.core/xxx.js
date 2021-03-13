//发布订阅模块
const util = require('util')
let EventEmitter = require('./events');
// let e = new EventEmitter();
//让我的类具备这种功能
function Girl () {
    EventEmitter.call(this);
}
//继承原型上的方法
util.inherits(Girl, EventEmitter);
Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype)
Girl.prototype.__proto__ = EventEmitter.prototype;
Girl.prototype = Object.create(EventEmitter.prototype)
let girl = new Girl;
//可以监听用户做了哪些监听
//必须叫newListener
girl.on('newListener', (type) => {
    if (type === '失恋') {//每次on 就执行一次
        process.nextTick(() => {
            girl.emit(type);//执行的时候 数组有2个 2*2 = 4 这个要执行2次
        })
    }
})
//失恋;[fn1, fn1]
let fn1 = (w) =>  {
    console.log(w+'监听到了执行')//先走上面那个 才会走这个
}
girl.once('失恋',fn1);
// girl.off('失恋', fn1);
girl.once('失恋', function(w) { //默认这个方法
    console.log(w+'监听到了执行')//绑2个触发4次
})
girl.emit('失恋','wo')
// 当用户监听了失恋  就去执行这个函数
let lisenter = (w) => {
    console.log(w+'吃东西')
}
let lisenter1 = (w) => {
    console.log(w+'逛街')
}
girl.on('女生失恋', lisenter)
girl.on('女生失恋', lisenter1)
girl.emit('女生失恋','我')
