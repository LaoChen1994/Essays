const { ListNode } = require("./index");

/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
    let p1 = head, p2 = null, step = 0

    while (p1 !== null) {
        p1 = p1.next;
        step++;
        if (step >= n + 1) {
            if (p2 === null) {
                p2 = head
            } else {
                p2 = p2.next
            }
        }
    }

    if (p2 === null) {
        head = head.next
    }

    if (p2 && p2.next !== null) {
        p2.next = p2.next.next
    }

    return head
};

let list = ListNode.getSingleListNodeFromArray([1, 2])

list = removeNthFromEnd(list, 1)

console.log(list === null ? [] : list.getNodes())