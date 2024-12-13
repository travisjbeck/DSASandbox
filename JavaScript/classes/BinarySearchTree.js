
class TreeNode {
  constructor(value) {
    this.left = null;
    this.right = null;
    this.value = value;
  }
}



class BinarySearchTree {

  constructor() {
    this.root = null;
    this.size = 0;
  }

  isEmpty() {
    return !this.root;
  }

  insert(val) {
    const node = new TreeNode(val);
    this.size++
    if (this.isEmpty()) {
      this.root = node;
      return;
    }
    //insertion needs to balance out the tree
    //travel the tree to find a spot

    this.insertNode(this.root, node);
  }

  insertNode(rootNode, newNode) {
    if (newNode.value > rootNode.value) {
      if (rootNode.right) {
        this.insertNode(rootNode.right, newNode);
      } else {
        rootNode.right = newNode;
      }
    } else {
      if (rootNode.left) {
        return this.insertNode(rootNode.left, newNode);
      } else {
        return rootNode.left = newNode;
      }
    }
  }

  search() {

  }

  delete() {

  }
}


const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(4);
console.log('Is empty', bst.isEmpty())
