//观察者模式 被观察者模式 被观察者模式
//将所有的观察者都放到被观察者中 (基于发布订阅) 状态变了 立马通知
//被观察者
class Subject {
  constructor(name) {
    this.name = name;
    this.observers = [];
    this.state = "玩呢";
  }
  attach(o) {
    //被观察者要错放所有的观察者
    this.observers.push(o);
  }
  setState(newState) {
    this.state = newState;
    this.observers.forEach((o) => o.update(this));
  }
}
//观察者
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(baby) {
    console.log(baby.name + `跟${this.name}说${baby.state}`);
  }
}
let baby = new Subject("宝宝");
let o1 = new Observer("baba");
let o2 = new Observer("mama");
baby.attach(o1);
baby.attach(o2);
baby.setState('有人打我')
//小宝宝  status 变化 主动通知
