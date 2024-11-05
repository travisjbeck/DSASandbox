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
      this.currentLength++;
      this.rear = (this.rear + 1) % this.items.length //modulo wrap around
    }
  }

  dequeue() {
    if (this.items[this.front]) {
      const item = this.items[this.front];
      this.items[this.front] = null;
      this.front = (this.front + 1) % this.items.length //modulo wrap-around
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

    if (this.isEmpty()) {
      return console.log([]);
    }

    // This is cleaner but has higher memory usage as it's creating 4 new arrays. 
    // const sorted = [...this.items.slice(this.front), ...this.items.slice(0, this.front)]
    // const filtered = sorted.filter(o => !!o)



    // Both methods have O(n) time complexity, but this one only creates 1 new array. 
    let i = 0;
    //set up an array to our current size to 
    let printArr = new Array(this.currentLength);
    //start at front, go to end. 
    for (var p = this.front; p < this.items.length; p++) {
      if (this.items[p]) {//make sure we have a value here
        printArr[i] = this.items[p];
        i++;
      }
    }

    //start at 0 go to front. 
    for (var p = 0; p < this.front; p++) {
      if (this.items[p]) {
        printArr[i] = this.items[p];
        i++;
      }
    }

    console.log(printArr);
  }

}


const queue = new CircularQueue(5);
queue.print();

queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
queue.enqueue(40);
queue.enqueue(50);

queue.print();

console.log(queue.dequeue());

queue.print();
queue.enqueue(60);
queue.print();
console.log(queue.dequeue());
console.log(queue.dequeue());
console.log(queue.dequeue());
console.log(queue.dequeue());
queue.enqueue(70);
queue.enqueue(80);
queue.enqueue(90);
queue.print();
console.log(queue.dequeue());
console.log(queue.dequeue());
console.log(queue.dequeue());
queue.enqueue(100);
queue.print();
queue.enqueue(110);
queue.print();
console.log(queue.dequeue());
queue.print();