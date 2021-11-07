class Node {
  constructor(value) {
    this.value = value;
    this.nextNode = null;
    this.prevNode = null;
  }
}

class LinkList {
  constructor() {
    this.firstNode = null;
    this.lastNode = null;
  }

  add(node) {
    const newNode = node instanceof Node ? node : new Node(node);

    if (!this.firstNode) {
      this.firstNode = newNode;
      this.lastNode = this.firstNode;
      return this;
    } else {
      newNode.prevNode = this.lastNode;
      this.lastNode.nextNode = newNode;
      this.lastNode = this.lastNode.nextNode;
    }

    return this;
  }

  read(idx) {
    if (!this.firstNode) return undefined;
    let i = 0;
    let rlt = undefined;
    this.tranverse((node, setContinue) => {
      if (i !== idx) {
        i++;
        return;
      }

      rlt = node.value;
      setContinue(false);
    });

    return rlt;
  }

  tranverse(fn) {
    let node = this.firstNode;
    let isContinue = true;

    const setContinue = (value) => {
      isContinue = value;
    };

    while (isContinue) {
      if (!node) {
        break;
      }
      fn(node, setContinue);
      node = node.nextNode;
    }
  }

  tranverseRight(fn) {
    let node = this.lastNode;
    let isContinue = true;

    const setContinue = (value) => {
      isContinue = value;
    };

    while (isContinue) {
      if (!node) {
        break;
      }
      fn(node, setContinue);
      node = node.prevNode;
    }
  }

  showAll() {
    let content = [];
    this.tranverse((node) => {
      const value = node.value;
      content.push(value);
    });

    console.log(content.join(" -> "));
  }

  showAllReverse() {
    let content = [];
    this.tranverseRight((node) => {
      const value = node.value;
      content.push(value);
    });

    console.log(content.join(" <- "));
  }

  indexOf(value) {
    let idx = 0;
    let currentIdx = undefined;

    this.tranverse((node, setContinue) => {
      if (node.value !== value) {
        idx++;
        return;
      }

      currentIdx = idx;
      setContinue(false);
    });

    return currentIdx;
  }

  insertNode(pos, node) {
    let _node = node instanceof Node ? node : new Node(node);
    let isSuccess = false;

    let idx = 0;
    if (pos === idx) {
      // 第一个节点插入
      _node.nextNode = this.firstNode;
      this.firstNode = _node;
      return true;
    }

    this.tranverse((node, setContinue) => {
      if (idx !== pos - 1) {
        idx++;
        return;
      }

      let nextNode = node.nextNode;
      _node.prevNode = node;
      node.nextNode = _node;
      nextNode.prevNode = node.newNode;
      node.nextNode.nextNode = nextNode;
      isSuccess = true;
      setContinue(false);
    });

    if (!isSuccess) {
      throw Error("未找到对应插入节点");
    }

    return true;
  }

  deleteNode(pos) {
    let idx = 0;
    let rlt = false;

    if (pos === 0) {
      const prevFirstNode = this.firstNode;
      prevFirstNode.prevNode = null;
      this.firstNode = prevFirstNode.nextNode;
      prevFirstNode.nextNode = null;
      return true;
    }

    this.tranverse((node, setContinue) => {
      if (idx === pos - 1) {
        const nextNode = node.nextNode;
        if (!nextNode) {
          return;
        }

        nextNode.nextNode.prevNode = node;
        node.nextNode = nextNode.nextNode;
        nextNode.nextNode = null;
        nextNode.prevNode = null;
        setContinue(false);
      }

      idx++;
    });

    return rlt;
  }
}

const linkList = new LinkList();
linkList.add(3).add(4).add(5).add(10).add(20);

console.log(linkList.read(3));
console.log(linkList.indexOf(10));

linkList.insertNode(0, 1);
linkList.insertNode(1, 2);

linkList.showAll();

linkList.deleteNode(1);

linkList.showAll();

linkList.showAllReverse()
