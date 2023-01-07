const { ListNode } = require("../../core/list-node")
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var middleNode = function(head) {
    let fast = head, slow = head;
    let count = 0;
    while(fast !== null) {
        fast = fast.next;
        count++;

        if (!(count % 2)) {
            slow = slow.next;
        }
    }

    return slow;
};

const result = middleNode(ListNode.getSingleListNodeFromArray([1,2,3,4,5,6]))

console.log(result)