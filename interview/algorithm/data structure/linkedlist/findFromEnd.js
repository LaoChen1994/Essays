const { ListNode } = require("../../core/list-node")

/**
 * @param {ListNode} head
 * @param {number} k
 */
function findFromEnd(head, k) {
    let dummy1 = head, dummy2 = head;
    let i = 0;

    while (i < k) {
        dummy1 = dummy1.next;
        i++;
    }

    while (dummy1 !== null) {
        dummy1 = dummy1.next;
        dummy2 = dummy2.next
    }

    return dummy2
}

const list = ListNode.getSingleListNodeFromArray([1, 2, 3, 4, 5])

console.log(findFromEnd(list, 2))