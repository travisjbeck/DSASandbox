class Queue {
  constructor() {
    this.items = new Map() //Using map instead of array so it is of O(1) time complexity instead of O(n)
    this.front = 0;
    this.rear = 0;
  }

  enqueue(item) {
    this.items.set(this.rear, item);
    this.rear++;
  }

  dequeue() {
    const item = this.items.get(this.front);
    this.items.delete(this.front);
    this.front++;
    return item;
  }

  isEmpty() {
    return this.items.size == 0;
  }

  peek() {
    return this.items.get(this.front);
  }

  print() {
    console.log(this.items);
  }

  size() {
    return this.items.size;
  }

}



const queue = new Queue();
queue.print();

queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);

queue.print();

queue.dequeue();

queue.print();
console.log(`Queue size: ${queue.size()}`)

queue.dequeue();
queue.print();

queue.enqueue(50);

queue.print();
