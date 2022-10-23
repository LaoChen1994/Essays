const { ListNode } = require('./index.js')

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
 var getIntersectionNode = function(headA, headB) {
    let p1 = headA, p2 = headB;

    let flag1 = false, flag2 = false

    while (p1 !== null && p2 !== null) {
        if (p1 === p2) {
            return p1
        }

        if (p1.next === null && !flag1) {
            p1 = headB
            flag1 = true
        } else {
            p1 = p1.next
        }

        if (p2.next === null && !flag2) {
            p2 = headA
            flag2 = true
        } else {
            p2 = p2.next
        }
    }

    return null
};

const p1 = ListNode.getSingleListNodeFromArray([4, 1])
const p2 = ListNode.getSingleListNodeFromArray([7, 8])
const common = ListNode.getSingleListNodeFromArray([10, 11])

/**
 * 
 * @param {ListNode} p1
 * @param {ListNode} p2
 * @returns {ListNode}
 */
function join (p1, p2) {
    let dummy = p1;

    while (dummy !== null) {
        if (dummy.next === null) {
            dummy.next = p2
            break
        }
        dummy = dummy.next
    }

    return p1
}

console.log(getIntersectionNode(join(p1, common), join(p2, common)))