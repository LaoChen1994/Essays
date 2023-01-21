const { ListNode } = require('../../core/list-node')

/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function(head, left, right) {
    let start = head;
    let i = 1;
    const isReverseFirst = left === 1 && left !== right

    if (head === null || head.next === null) {
        return head
    }

    while (i < left - 1) {
        start = start.next;
        i++;
    }

    let _curr = start.next
    let _next = start.next.next;

    while (i < right - 1) {
        if (_curr === start.next) {
            // p1 => p2 => p3
            _curr.next = null
        }

        const nextNode = _next.next;
        _next.next = _curr;
        _curr = _next;
        _next = nextNode
        i++
    }

    start.next.next = isReverseFirst ? head : _next;
    start.next = isReverseFirst ? null : _curr

    return isReverseFirst ? _curr : head
};

const list = ListNode.getSingleListNodeFromArray([1, 2, 3])

const reverse = reverseBetween(list, 1, 2)

console.log(reverse.getNodes())