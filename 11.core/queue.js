const LinkList = require('./linkList')

class Queue {
    constructor() {
        this.ll = new LinkList();
    }
    offer(element) { //入队列
      this.ll.add(element);
    }
    poll() {
        return this.ll.remove(0)
    }
}
module.exports = Queue