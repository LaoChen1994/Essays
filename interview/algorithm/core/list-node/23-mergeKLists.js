const { ListNode } = require("./index")
const { mergeTwoLists } = require("./21-mergeTwoList")
const { MinHeap } = require('./heap')

/**
 * 
 * @param {ListNode[]} lists 
 * @returns {ListNode}
 */
function mergeKLists(lists) {
    // 归并的方式合并
    if (!lists.length) return []

    /**
     * 
     * @param {ListNode[]} lists 
     * @param {number} start 
     * @param {number} end
     * @returns {ListNode}
     */
    function _merge (lists, start, end) {
        if (end - start <= 1) {
            return lists[start]
        }

        const mid = (start + end) >> 1
        return mergeTwoLists(_merge(lists, start, mid), _merge(lists, mid, end))
    }

    return _merge(lists, 0, lists.length)
}

/**
 * 
 * @param {ListNode[]} lists 
 * @returns {ListNode}
 */
function mergeKListsWithHeap(lists) {
    lists = list.filter(item => item !== null)
    if (!lists.length) return null
    const heap = new MinHeap(lists, (node) => {
        return node.val
    })
    const p = new ListNode()
    let dummy = p
    if (!lists.length) return null

    while(heap.value.length > 0) {
        let p = heap.pop()
        if (p === null) {
            continue;
        }
        dummy.next = p;
        dummy = dummy.next
        p = p.next
        if (p === null) {
            continue
        }
        heap.add(p)
    }

    return p.next
}

const result = mergeKLists([
    ListNode.getSingleListNodeFromArray([1, 4, 5]),
    ListNode.getSingleListNodeFromArray([1, 3, 4]),
    ListNode.getSingleListNodeFromArray([2, 6])
])

console.log(result.getNodes())