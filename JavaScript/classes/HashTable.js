// HashTable JS implementation
// Map is already a hash table, but we're going to implement our own
// how to handle collisions. store a linked list at each array index. the nodes in the linked list
// the nodes of the linked list must have a key and value property. this could be a map object?
import LinkedListKVP from "./LinkedListKVP.js";


class HashTable {
  constructor(size) {
    this.table = new Array(size)
    this.size = size
  }

  set(key, value) {
    const index = this.hash(key)
    if (this.table[index]) {
      //apppend to the linked list our new node
      const linkedList = this.table[index]
      linkedList.append(key, value)
    } else {
      //create new linked list and add our node
      const linkedList = new LinkedListKVP();
      linkedList.append(key, value)
      this.table[index] = linkedList;
    }
  }

  get(key) {
    const index = this.hash(key)
    const linkedList = this.table[index];
    if (!linkedList) {
      return null;
    }

    return linkedList.search(key);
  }

  remove(key) {
    const index = this.hash(key)
    const linkedList = this.table[index];
    if (!linkedList) {
      return null;
    }
    const keyIndex = linkedList.indexOf(key);
    if (keyIndex == -1) {
      return null;
    }
    return linkedList.removeAt(keyIndex);
  }

  display() {
    for (let linkedList of this.table) {
      if (linkedList) {
        linkedList.print()
      }
    }
  }

  hash(key) {
    // get the string char value and modulo by our size
    const totalAscii = key.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return totalAscii % this.size
  }
}


const table = new HashTable(50)
table.set("t", "T dawg and the infinite blah blah balh")
table.set("lett", "This is the lett value'")
table.set("ttel", "This is the tell value'")
table.set("tell it", "This is the tell it value")
table.set("vim", "This is the vim value")

table.display()
