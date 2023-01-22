const { ListNode } = require('../../core/list-node')

/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function(head, left, right) {
    let start = head;
    let prev = null;
    let i = 1;

    if (head === null || head.next === null) {
        return head
    }

    while (i < left) {
        prev = start;
        start = start.next;
        i++;
    }

    let _curr = start;
    let _next = _curr.next;

    while (i < right) {
        // p1 => p2 => p3 => p4
        let next = _next;
        _next = _next.next
        next.next = _curr;
        _curr = next
        i++
    }

    if (prev === null) {
        head.next = null;
        start.next = _next
        return _curr
    } else {
        prev.next = _curr;
        start.next = _next;
    }

    return head
};

const list = ListNode.getSingleListNodeFromArray([1, 2, 3, 4, 5])

const reverse = reverseBetween(list, 1, 4)

console.log(reverse.getNodes())