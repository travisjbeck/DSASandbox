class CircularQueue {
  constructor(size) {
    this.items = new Array(size).fill(null, 0, size);
    this.front = 0;
    this.rear = 0;
  }

  enqueue(item) {
    if (!this.items[this.rear]) {
      this.items[this.rear] = item;
      this.rear++;
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
      return item;
    }
    return null;
  }

  size() {
    return this.rear = this.front;
  }

  isEmpty() {
    return this.rear = this.front === 0;
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

queue.enqueue(50);

queue.print();

queue.enqueue(60);

queue.print();

queue.enqueue(70);

queue.print();

queue.enqueue(80);

queue.print();

queue.dequeue();

queue.print();

queue.dequeue();

queue.print();

queue.dequeue();

queue.print();

queue.dequeue();

queue.print();