const { ListNode } = require("./index")

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
 var deleteDuplicates = function(head) {
    let slow = head, fast = head;

    if (head === null) {
        return null
    }

    while (fast !== null) {
        if (fast.val !== slow.val) {
            slow = slow.next;
            slow.val = fast.val
        }

        fast = fast.next
    }

    slow.next = null

    return head
};

console.log(deleteDuplicates(ListNode.getSingleListNodeFromArray([1, 1, 2])).getNodes())


