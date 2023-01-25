const { ListNode } = require('../../core/list-node')

/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function(head, left, right) {
    let i = 0;
    let start = head, prev = head;
    while(i < left - 1) {
        prev = start;
        start = start.next;
        i++;
    }

    let end = start;
    while (i < right - 1) {
        end = end.next;
        i++
    }

    const next = end.next;
    end.next = null;

    const re = reverse(start);

    if (left === 1) {
        start.next = next
        return re
    }

    prev.next = re
    start.next = next;

    return head
}

/**
 * @param {ListNode} head
 */
function reverse (head) {
    if (head === null || head.next === null) {
        return head
    }

    const re = reverse(head.next);
    head.next.next = head;
    head.next = null

    return re
}

const list = ListNode.getSingleListNodeFromArray([1, 2, 3, 4, 5])

const res = reverseBetween(list, 2, 4)

console.log(res.getNodes())
