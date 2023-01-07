const {ListNode} = require("../../core/list-node")

// 每次两个两个问题处理的时候
// 可以使用归并的思想，把父问题处理成多个子问题

/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
function mergeKLists(lists) {
    const len = lists.length;
    const mid = Math.floor(len / 2)

    switch (len) {
        case 0:
            return null
        case 1:
            return lists[0]
        case 2:
            return mergeTwoList(lists[0], lists[1])

        default:
            return mergeTwoList(
                mergeKLists(lists.slice(0, mid)),
                mergeKLists(lists.slice(mid))
            )
    }
}

/**
 * @param {ListNode} list
 * @param {ListNode} list
 * @return {ListNode}
 */
function mergeTwoList(l1, l2) {
    const head = new ListNode();
    let curr = head
    let dummy1 = l1, dummy2 = l2;

    while (dummy1 !== null && dummy2 !== null) {
        if (dummy1.val < dummy2.val) {
            curr.next = dummy1;
            dummy1 = dummy1.next;
        } else {
            curr.next = dummy2;
            dummy2 = dummy2.next;
        }

        curr = curr.next;
    }

    if (dummy1 !== null) {
        curr.next = dummy1
    }

    if (dummy2 !== null) {
        curr.next = dummy2
    }

    return head.next
}

const lists = [
    ListNode.getSingleListNodeFromArray([1, 4, 5]),
    ListNode.getSingleListNodeFromArray([1, 3, 4]),
    ListNode.getSingleListNodeFromArray([2, 6])
]

console.log(mergeKLists(lists).getNodes())