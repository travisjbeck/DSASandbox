const LinkedList = require("./LinkedList");


class Queue {
  constructor() {
    this.list = new LinkedList();
  }

  enqueue(value) {
    this.list.append(value);
  }

  dequeue() {
    return this.list.removeFromFront();
  }

  peek() {
    return this.list.head.value;
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


const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.print();
console.log(queue.dequeue());
queue.print();
queue.enqueue(4); queue.enqueue(5);
queue.print();