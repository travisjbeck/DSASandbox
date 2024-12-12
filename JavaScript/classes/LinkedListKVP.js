// a LinkedList that takes Key value pairs; 


class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class LinkedListKVP {
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

  prepend(key, value) {
    const node = new Node(key, value);

    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this.size++;
  }

  append(key, value) {
    const node = new Node(key, value);
    //if this is the first node, just set head to it, otherwise point the last node to the new one
    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
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
      let prev = this.head;
      while (prev.next !== this.tail) {
        prev = prev.next
      }
      this.tail = prev;
      prev.next = null;
    }
    this.size--;
    return removedNode.value;
  }

  search(key) {
    if (this.isEmpty()) {
      return null;
    }

    let curr = this.head;
    let i = 0;
    while (curr) {
      if (curr.key === key) {
        return curr.value;
      }
      curr = curr.next
      i++;
    }
    return null;
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
export default LinkedListKVP;


