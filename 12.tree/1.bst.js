class Node {
  //节点之间有一个parent属性
  constructor(element, parent) {
    this.element = element;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }
}
class BST {
  constructor() {
    this.root = null;
    this.size = 0;
  }
  add(element) {
    if (this.root == null) {
      this.root = new Node(element, null);
      this.size++;
      return;
    }
    //根据根的值来比较插入
    //根据条件不停的找 找到节点为空时  将上一步的值保存起来 将节点插入到保存的节点中
    let currentNode = this.root;
    let parent = null;
    let compare = null;
    //找到parent
    while (currentNode) {
      compare = element - currentNode.element;
      parent = currentNode; // parent 就是在进入左右子树之前保存下来的节点
      if (compare > 0) {
        currentNode = currentNode.right;
      } else if (compare < 0) {
        currentNode = currentNode.left;
      } else {
        currentNode.element = element;
        return;
      }
    }
    let newNode = new Node(element, parent);

    if (compare > 0) {
      parent.right = newNode;
    } else {
      parent.left = newNode;
    }
    this.size++;
  }
  preorderTraversal(vistor) {
    const traversal = (node) => {
      if (node == null) return;
      console.log(node.element);
      vistor.visit(node);
      traversal(node.left)
      traversal(node.right)
    };
    traversal(this.root);
  }
  inorderTraversal(vistor) {
    const traversal = (node) => {
        if (node == null) return;
        traversal(node.left)
        console.log(node.element);
        vistor.visit(node);
        traversal(node.right)
      };
      traversal(this.root);
  }
//根据parent属性 一般情况下 都可以用栈型结构 去避免递归
  postorderTraversal(vistor) {
    const traversal = (node) => {
        if (node == null) return;
       
        traversal(node.left)
        traversal(node.right)
        console.log(node.element);
        vistor.visit(node);
      };
      traversal(this.root);
  }
  levelTraversal(vistor) {
      if (this.root == null) return;
      //栈型结构
      let stack = [this.root]; //10
      let index = 0;
      let currentNode = null;
      while(currentNode = stack[index++]) {
        vistor.visit(currentNode);
         if (currentNode.left) {
             stack.push(currentNode.left);
            
         }
         if (currentNode.right) {
            stack.push(currentNode.right);
           
        }
      }

  }
  //左右互换 树的遍历
  invertTree() {
    if (this.root == null) return;
    //栈型结构
    let stack = [this.root]; //10
    let index = 0;
    let currentNode = null;
    while(currentNode = stack[index++]) {
        let temp = currentNode.left;
        currentNode.left = currentNode.right;
        currentNode.right = temp;
       if (currentNode.left) {
           stack.push(currentNode.left);
          
       }
       if (currentNode.right) {
          stack.push(currentNode.right);
      }
    }

  }
}
let bst = new BST();
let arr = [10, 8, 19, 6, 15, 22, 20];
arr.forEach((item) => {
  bst.add(item); //二叉搜索树的内容可比较性
});
// bst.add(24);
// console.dir(bst, { depth: 10 });
//访问者模式 传入一个访问器
// console.log(bst.levelTraversal({
//     visit(node) {
//      console.log(node.element, 'node------')
//     }
// }));
//常见的遍历方式 前序遍历 中序 后序 层序
//二叉树的反转 文件夹的操作
bst.invertTree()
console.dir(bst.root);