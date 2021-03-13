function EventEmitter() {
  this._events = Object.create(null); //创建的对象 没有属性
}
//{'name': [lisener1, lisener2]}
// Girl.on()
//绑定执行后 删除
EventEmitter.prototype.once = function (eventname, callback) {
  //触发one函数 在触发钱干一些事情
  let one = (...args) => {
    callback(...args); //触发完毕后删除自己
    this.off(eventname, one); //再将one删掉
  };
  one.l = callback;//用自定义属性 保存原有的绑定函数
  this.on(eventname, one);
};
//删除
EventEmitter.prototype.off = function (eventname, callback) {
  if (this._events[eventname]) {
    this._events[eventname] = this._events[eventname].filter(
      (fn) => fn != callback && fn.l !== callback
    );
  }
};
EventEmitter.prototype.on = function (eventname, callback) {
  //不管任何人调用了on方法 都会有_events属性
  if (!this._events) this._events = Object.create(null);
  //监听事件 不是newListener 就调用newListener
  if (eventname !== "newListener") {
    this.emit("newListener", eventname);
  }
  if (this._events[eventname]) {
    this._events[eventname].push(callback);
  } else {
    this._events[eventname] = [callback];
  }
};
EventEmitter.prototype.emit = function (eventname, ...args) {
  if (this._events[eventname])
    this._events[eventname].forEach((fn) => fn.call(this,...args));
};
module.exports = EventEmitter;
