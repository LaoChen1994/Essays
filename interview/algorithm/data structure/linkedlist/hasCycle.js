const { ListNode } = require("../../core/list-node")

function hasCycle (head) {
    let slow = head, fast = head;

    while (fast !== null || fast.next !== null) {
        fast = fast.next.next;
        slow = slow.next

        if (fast === slow) {
            return false
        }
    }

    return false
}