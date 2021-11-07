class BinarayTree {
  constructor() {
    this.root = null;
  }

  traverseNode(node = this.root) {
    if (!node) return;

    this.traverseNode(node.leftNode);
    console.log(node.value);
    this.traverseNode(node.rightNode);
  }

  insertNode(nodeVal) {
    const newNode = nodeVal instanceof TreeNode ? node : new TreeNode(nodeVal);

    if (!this.root) {
      this.root = newNode;
      return this;
    }

    let node = this.root;

    while (node) {
      if (node.value > nodeVal) {
        if (!node.leftNode) {
          node.leftNode = newNode;
          break;
        } else {
          node = node.leftNode;
        }
      }

      if (node.value <= nodeVal) {
        if (!node.rightNode) {
          node.rightNode = newNode;
          break;
        } else {
          node = node.rightNode;
        }
      }
    }

    return this;
  }

  searchNode(nodeVal) {
    let node = this.root;

    while (node !== null) {
      if (node.value > nodeVal) {
        node = node.leftNode;
        continue;
      }

      if (node.value === nodeVal) return true;

      if (node.value < nodeVal) {
        node = node.rightNode;
      }
    }

    return false;
  }

  _findSuccessorNode(subTree) {
    let node = subTree;
    let parentNode = subTree;

    while (node !== null) {
      if (node.leftNode) {
        parentNode = node;
        node = node.leftNode;
        continue;
      } else {
        // 最后一个左节点
        if (!parentNode || parentNode === subTree) {
          return node;
        } else {
          parentNode.leftNode = node.rightNode;
          node.rightNode = null;
          return node;
        }
      }
    }
  }

  deleteNode(nodeVal) {
    let node = this.root;
    let parentNode = null;
    let nodePos = "leftNode";

    while (node !== null) {
      if (node.value === nodeVal) {
        // 叶子节点
        if (!node.leftNode && !node.rightNode) {
          if (!parentNode) {
            this.root = null;
            break;
          }

          parentNode[nodePos] = null;
        }

        // 左右子节点都存在
        if (node.leftNode && node.rightNode) {
          const successorNode = this._findSuccessorNode(
            node.rightNode,
            node
          );

          if (node.rightNode !== successorNode) {
            successorNode.rightNode = node.rightNode;
          }

          successorNode.leftNode = node.leftNode
          parentNode[nodePos] = successorNode;
          break;
        }

        // 左右子节点存在一边的场景
        if (node.leftNode) {
          parentNode[nodePos] = node.leftNode;
          break;
        }

        if (node.rightNode) {
          parentNode[nodePos] = node.rightNode;
          break;
        }
      }

      parentNode = node;

      if (node.value > nodeVal) {
        node = node.leftNode;
        nodePos = "leftNode";
        continue;
      }

      if (node.value < nodeVal) {
        node = node.rightNode;
        nodePos = "rightNode";
      }
    }
  }
}

class TreeNode {
  constructor(value, leftNode = null, rightNode = null) {
    this.value = value;
    this.leftNode = leftNode;
    this.rightNode = rightNode;
  }
}

const binaryTree = new BinarayTree();

binaryTree
  .insertNode(5)
  .insertNode(4)
  .insertNode(1)
  .insertNode(3)
  .insertNode(8)
  .insertNode(9)
  .insertNode(10)
  .insertNode(7);

binaryTree.traverseNode();

const searchRlt = binaryTree.searchNode(8);

console.log("search 8 ->", searchRlt);

binaryTree.deleteNode(8);

console.log("search 8 ->", binaryTree.searchNode(8));

console.log("search  7 ->", binaryTree.searchNode(7));
console.log("search  9 ->", binaryTree.searchNode(9));

binaryTree.traverseNode();
