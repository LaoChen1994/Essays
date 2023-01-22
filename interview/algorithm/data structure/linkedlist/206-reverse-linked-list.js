const { ListNode } = require('../../core/list-node')

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    if (head === null || head.next === null) {
        return head;
    }

    let _head = head;
    let _next = head.next;

    while (_next !== null) {
        if (_head === head) {
            _head.next = null
        }

        let nextNode = _next.next;
        _next.next = _head
        _head = _next;
        _next = nextNode
    }

    return _head
}



const list = ListNode.getSingleListNodeFromArray( [1])

const reverse = reverseList(list)

console.log(reverse.getNodes())