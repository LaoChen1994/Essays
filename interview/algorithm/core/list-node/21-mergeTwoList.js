const { ListNode } = require("./index")

/**
 * 
 * @param {ListNode} list1 
 * @param {ListNode} list2 
 * @returns {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
    var newList = new ListNode()
    curr = newList

    while (list1 !== null && list2 !== null) {
        if (list1.val < list2.val) {
            curr.next = list1
            list1 = list1.next
        } else {
            curr.next = list2
            list2 = list2.next
        }

        curr = curr.next
    }

    if (list1 === null) {
        curr.next = list2
    }

    if (list2 === null) {
        curr.next = list1
    }

    return newList.next
};

const list1 = ListNode.getSingleListNodeFromArray([1, 2, 4])
const list2 = ListNode.getSingleListNodeFromArray([1, 3, 4])

const mergeList = mergeTwoLists(list1, list2)

console.log(mergeList.getNodes())

module.exports = {
    mergeTwoLists
}