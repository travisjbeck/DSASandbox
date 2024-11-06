class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}


class LinkedList {
  constructor() {
    this.head = null; //points to the first node
    this.size = 0;
  }

  isEmpty() {
    return this.size === 0;
  }

  getSize() {
    return this.size;
  }

  //O(1)
  prepend(value) {
    const node = new Node(value);
    //do we already have a head? if so. point our new node to it and set our head to the new node
    if (this.head) {
      node.next = this.head;
    }
    this.head = node;
    this.size++;
  }

  //O(n)
  //can make it O(1) with a tail pointer
  append(value) {
    const node = new Node(value);

    //if this is the first node, just set head to it, otherwise point the last node to the new one
    if (this.isEmpty()) {
      this.head = node;
    } else {
      //find last node and update it's next property to this node. 
      let prev = this.head;
      while (prev.next) {
        prev = prev.next;
      }
      prev.next = node;
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

    if (index == 0) {
      removedNode = this.head;
      this.head = this.head.next;
    } else {
      let prev = this.head;
      //get the node to the left of the index we're removing
      for (let i = 0; i < index - 1; i++) {
        prev = prev.next;
      }
      //save the node we're removing
      removedNode = prev.next;
      //set the node to its left to point to the node the removed node was pointing to
      prev.next = removedNode.next
    }

    this.size--;
    return removedNode.value;
  }

  print() {
    if (this.isEmpty()) {
      console.log("Empty");
    }

    let curr = this.head;
    let i = 0;
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



const list = new LinkedList();
console.log('list is empty?: ', list.isEmpty());
console.log('size: ', list.getSize());


list.append(10);
list.append(20);
list.append(30);
list.print();
list.insert(25, 2);

list.print();
console.log(list.removeFrom(2));
list.print();

