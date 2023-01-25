const { ListNode } = require("../../core/list-node")

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    if (head == null || head.next == null) {
        return head;
    }

    const reverse = reverseList(head.next);

    head.next.next = head
    head.next = null

    return reverse
}

const list = ListNode.getSingleListNodeFromArray( [
    1, 2, 3, 4, 5, 6
])

const reverse = reverseList(list)

console.log(reverse.getNodes())
