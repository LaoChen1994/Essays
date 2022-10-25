const { ListNode } = require("./index");

/**
 * 
 * @param {ListNode} node 
 */
function reverse(node) {
  const res = [];

  /**
   *
   * @param {ListNode} node
   */
  function traverse(node) {
    if (node === null) return;

    traverse(node.next);
    res.push(node.val)
  }

  traverse(node)

  return res
}

const list = ListNode.getSingleListNodeFromArray([1, 2, 3, 4, 5, 6]);
console.log(reverse(list))
