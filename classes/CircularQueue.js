class CircularQueue {

  constructor(size) {
    this.items = new Array(size);
    this.front = 0;
    this.rear = 0;
    this.currentLength = 0;
  }

  enqueue(item) {
    if (!this.items[this.rear]) {
      this.items[this.rear] = item;
      this.rear++;
      this.currentLength++;
      if (this.rear === this.items.length) {
        this.rear = 0;
      }
    }
  }

  dequeue() {
    if (this.items[this.front]) {
      const item = this.items[this.front];
      this.items[this.front] = null;
      this.front++;
      if (this.front === this.items.length) {
        this.front = 0;
      }
      this.currentLength--;
      return item;
    }
    return null;
  }

  size() {
    return this.currentLength;
  }

  isEmpty() {
    return this.currentLength === 0;
  }

  isFull() {
    return this.currentLength === this.items.length;
  }

  peek() {
    return this.items[this.rear];
  }

  print() {
    console.log(this.items);
  }

}


const queue = new CircularQueue(5);
queue.print();

queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);

queue.print();

queue.dequeue();

queue.print();
console.log(`Queue size: ${queue.size()}`)
queue.enqueue(50);

queue.print();

queue.enqueue(60);

queue.print();
console.log(`isFull: ${queue.isFull()}`)

queue.enqueue(70);
queue.print();
console.log(`Queue size: ${queue.size()}`)

console.log(`isFull: ${queue.isFull()}`)

queue.enqueue(80);

queue.print();
console.log(`isFull: ${queue.isFull()}`)

queue.dequeue();

queue.print();
console.log(`Queue size: ${queue.size()}`)

console.log(`isFull: ${queue.isFull()}`)

queue.dequeue();

queue.print();

queue.dequeue();

queue.print();

queue.dequeue();

queue.print();