const {ListNode} = require("../../core/list-node");

/**
 * @param {ListNode} head
 * @param {number} x
 * @return {ListNode}
 */
var partition = function (head, x) {
    let l1 = new ListNode();
    let l2 = new ListNode();
    let curr = head

    let dummy1 = l1;
    let dummy2 = l2

    while (curr !== null) {
        if (curr.val >= x) {
            dummy2.next = curr;
            dummy2 = dummy2.next
        } else {
            dummy1.next = curr
            dummy1 = dummy1.next;
        }

        curr = curr.next
    }

    dummy2.next = null;
    dummy1.next = l2.next

    return l1.next
}


const l1 = ListNode.getSingleListNodeFromArray([2, 1])

const result = partition(l1, 2)

console.log(result.getNodes())