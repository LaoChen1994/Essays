const { ListNode } = require('../../core/list-node')

/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
    const newList = new ListNode();
    let curr = newList

    while (list1 !== null && list2 !== null) {
        if (list1.val < list2.val) {
            curr.next = list1
            list1 = list1.next;
        } else {
            curr.next = list2;
            list2 = list2.next;
        }

        curr = curr.next
    }

    if (list1 !== null) {
        curr.next = list1
    }

    if (list2 !== null) {
        curr.next = list2
    }

    return newList.next
}


const list1 = ListNode.getSingleListNodeFromArray([1,2,4])
const list2 = ListNode.getSingleListNodeFromArray( [1,3,4])

const result = mergeTwoLists(list1, list2);

console.log(result instanceof ListNode ? result.getNodes() : result)