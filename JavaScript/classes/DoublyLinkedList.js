class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null; //points to the first node
    this.tail = null;
    this.size = 0;
  }

  isEmpty() {
    return this.size === 0;
  }

  getSize() {
    return this.size;
  }

  prepend(value) {
    const node = new Node(value);

    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    this.size++;
  }

  append(value) {
    const node = new Node(value);
    //if this is the first node, just set head to it, otherwise point the last node to the new one
    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.size++;
  }

  insert(value, index) {
    if (index < 0 || index > this.size) {
      throw new Error(`Index out of bounds. Must be between 0 and ${this.size}`);
    }

    if (index === 0) {
      return this.prepend(value);
    }

    if (index === this.size) {
      return this.append(value);
    }

    const node = new Node(value);
    let prev = this.head;
    //find the node just before the index we want to insert to
    //We do i < index -1 because our node literally points to the next one
    for (var i = 0; i < index - 1; i++) {
      prev = prev.next;
    }
    //point our node at the node the previous node is pointed to
    node.next = prev.next;
    //point the previous node to us
    prev.next = node;

    this.size++;

  }

  removeFrom(index) {
    if (index < 0 || index >= this.size) {
      throw new Error(`Index out of bounds. Must be between 0 and ${this.size - 1}`);
    }

    let removedNode;

    if (index === 0) {
      return this.removeFromFront();
    }

    if (index === this.size - 1) {
      return this.removeFromEnd();
    }

    if (this.size === 1) {
      removedNode = this.head;
      this.head = null;
      this.tail = null;
    } else {
      let prev = this.head;
      //get the node to the left of the index we're removing
      for (let i = 0; i < index - 1; i++) {
        prev = prev.next;
      }
      //save the node we're removing
      removedNode = prev.next;

      //did we remove the last node?
      if (this.tail == removedNode) {
        this.tail = prev;
      }
      //set the node to its left to point to the node the removed node was pointing to
      prev.next = removedNode.next
    }

    this.size--;

    if (this.size <= 1) {
      this.tail = this.head;
    }
    return removedNode.value;
  }

  removeFromFront() {
    if (this.isEmpty()) {
      return null;
    }
    let removedNode = this.head;
    if (this.size === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = removedNode.next;
      this.head.prev = null;
    }
    this.size--;
    return removedNode.value;
  }

  removeFromEnd() {
    if (this.isEmpty()) {
      return null;
    }
    let removedNode = this.tail;
    if (this.size === 1) {
      this.head = null;
      this.tail = null;
    } else {

      let prev = this.tail.prev;

      this.tail = prev;
      prev.next = null;
    }
    this.size--;
    return removedNode.value;
  }

  search(value) {
    if (this.isEmpty()) {
      return -1;
    }

    let curr = this.head;
    let i = 0;
    while (curr) {
      if (curr.value === value) {
        return i;
      }
      curr = curr.next
      i++;
    }
    return -1;
  }

  reverse() {
    if (this.isEmpty()) {
      return;
    }
    let prev = null;
    let curr = this.head;
    this.tail = this.head;
    // point the first node to null
    // point each one afterwards to its previous
    // update head to the last one
    while (curr) {
      const next = curr.next;
      curr.next = prev;
      curr.prev = next;
      prev = curr;
      curr = next;
    }
    console.log(`head: ${prev.value}, tail: ${this.tail.value}`)
    this.head = prev;
    prev.prev = null;
  }


  print() {
    if (this.isEmpty()) {
      console.log("Empty");
    }

    let curr = this.head;
    let i = 0;
    //set our array to hold the print state. Initialized to the proper size
    let res = new Array(this.size);
    //walk the nodes and add them to the array to print
    while (curr) {
      res[i] = curr.value;
      curr = curr.next;
      i++;
    }
    console.log(res.toString());
  }
}
module.exports = DoublyLinkedList;


// const list = new LinkedList();
// console.log('list is empty?: ', list.isEmpty());
// console.log('size: ', list.getSize());


// list.append(10);
// list.append(20);
// list.append(30);
// list.prepend(5);
// list.print();
// list.insert(25, 2);

// list.print();
// console.log(list.removeFrom(2));
// list.print();
// console.log(list.search(20));
// list.reverse();
// list.print();
// console.log(list.removeFromEnd())
// list.print();
// list.append(50);
// list.print();
// console.log(list.removeFromFront());
// list.print();
