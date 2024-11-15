const LinkedList = require("./LinkedList");

class Stack {
  constructor() {
    this.list = new LinkedList();
  }

  //LIFO

  push(value) {
    this.list.append(value);
  }

  pop() {
    return this.list.removeFromEnd();
  }

  peek() {
    return this.list.tail.value;
  }

  isEmpty() {
    return this.list.isEmpty();
  }

  getSize() {
    return this.list.getSize();
  }
  print() {
    return this.list.print();
  }

}


let stack = new Stack();

stack.push(0);
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.pop());
stack.print();
console.log(stack.peek());