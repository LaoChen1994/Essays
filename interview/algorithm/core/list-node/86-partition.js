const { ListNode } = require("./index");

/**
 * @param {ListNode} head
 * @param {number} x
 * @return {ListNode}
 */
var partition = function (head, x) {
  let min = new ListNode();
  let max = new ListNode();
  let curr = head,
    minHead = min,
    maxHead = max;

  if (head === null) {
    return null;
  }

  while (curr !== null) {
    if (curr.val >= x) {
      maxHead.next = curr;
      maxHead = maxHead.next;
    } else {
      minHead.next = curr;
      minHead = minHead.next;
    }
    curr = curr.next;
    maxHead.next = null;
    minHead.next = null
  }

  minHead.next = max.next

  return min.next;
};

const node = partition(
  ListNode.getSingleListNodeFromArray([1, 4, 3, 2, 5, 2]),
  3
);
console.log(node.getNodes());
