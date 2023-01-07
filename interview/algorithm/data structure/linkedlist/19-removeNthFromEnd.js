const { ListNode } = require("../../core/list-node")

/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
    let dummy1 = head, dummy2 = head, prev = null
    let i = 0;

    while (dummy1 !== null) {
        dummy1 = dummy1.next;

        if (i < n) {
            i++;
        } else {
            prev = dummy2
            dummy2 = dummy2.next;
        }
    }

    if (prev === null) {
        head = head.next
    } else {
        prev.next = prev.next === null ? null : prev.next.next;
    }

    return head
}

const list = ListNode.getSingleListNodeFromArray([1])
const result = removeNthFromEnd(list, 1)

console.log(result.getNodes())