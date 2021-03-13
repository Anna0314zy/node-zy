//队列是先进先出 push shift
//栈型结构 -- push pop  方法调用栈 浏览器的历史记录 两个栈  判断语法是否正常合并 <div><span></div>   [div, span,] 
//
// 链表通过指针链接起来
//链表查找 删除的复杂度 o(n) 链表可以优化头尾操作
// 可以使用链表来实现栈或者队列
class Node {
    constructor(element, next) {
        this.element = element;
        this.next = next;
    }
}
class LinkList{
    constructor() {
        this.head = null;
        this.size = 0;
    }
    add(index, element) {
        if(arguments.length === 1) {
            element = index;
            index = this.size;
        }
        // console.log(index, element);
        if (index < 0 || index > this.size) throw new Error('链表索引异常')
        if (index == 0) {
            let head = this.head;
            this.head = new Node(element,head)
        }else {
            //找到添加的前一个人
            let preNode = this.getNode(index - 1); //这里前面节点肯定有 如果没有肯定是if
            preNode.next = new Node(element, preNode.next)
        }
        this.size++;
         
    }
    remove(index){ //删除节点
        let oldNode;
        if(index === 0) {
            oldNode = this.head;
            this.head = oldNode && oldNode.next;

        }else {
            let prevNode = this.getNode(index-1); //获取当前的前一个节点
            oldNode = prevNode.next; //前一个的下一个就是要删除的
            prevNode.next = oldNode.next;//让前一个下一个 指向之前的下一个

        }
        if(oldNode) this.size--;
        // console.log(this.size, 'size',oldNode)
        // console.log(oldNode,'oldNode')
        return oldNode && oldNode.element //返回删除节点
      
    }
    getNode(index){//获取节点
      let current = this.head; //从头找
      for(let i =0;i<index;i++) {
          current = current.next;
      }
      return current;
    }
    length() { //链表的总个数
       return this.size;
    }
    reverseLinkedList() {
        //递归
     function reverse(head) { //先递归里面的
         //如果链表为空 或者没有下一个就不用转了
         console.log(head, 'head')
         if (head == null || head.next == null) return head;
         let newHead = reverse(head.next);//将运来的下一个变成头结点
       head.next.next = head;//让下一个结点的下一个指向原来的头
       head.next = null;
       console.log(newHead, 'newHead')
       return newHead;
     }
    //  debugger
       //先交换300 跟 100 再交换100  跟200
       this.head = reverse(this.head) //返回一个新的链表
       return this.head;
    }
    //不递归
    reverseLinkedList2() {
      let head = this.head;
      if (head == null || head.next == null) return head;

      let newHead = null; //新的链表头部默认指向null
      while(head !== null) { //循环老的链表，将内容依次取出使用
          let temp = head.next; //存储的是100
          head.next = newHead;//让老的头指向新的 头
          newHead = head;//新的头指向了老的头
          head = temp;//老的头向后移动
      }
      this.head = newHead;
      return this.head;
    }

}
let ll = new LinkList();
// //ll.add(100,100);//这种越界了不行
// //head = 100 head=200 100
ll.add(0,100);//往索引0处添加
ll.add(0,200);
ll.add(300) //只传了一个
// ll.remove(1)
// console.log(ll.head)
// element: 200,
//next: Node { element: 100, next: Node { element: 300, next: null } }
let reverseList = ll.reverseLinkedList2();
// console.log(reverseList)
module.exports = LinkList
//TODO 如何实现链表反转

