class ListNode {
    constructor(val, next) {
        this.val = val || 0
        this.next = next || null
    }

    /**
     * 
     * @param {number[]} nums 
     * @returns {ListNode}
     */
    static getSingleListNodeFromArray (nums) {
        if (!nums.length) return null;

        const start = new ListNode(0)
        let curr = start

        for (let i = 0; i < nums.length; i++) {
            curr.next = new ListNode(nums[i])
            curr = curr.next            
        }

        return start.next
    }

    /**
     * 
     * @returns {number[]}
     */
    getNodes () {
        let arr = [];
        let curr = this;

        while (curr !== null) {
            arr.push(curr.val)
            curr = curr.next
        }

        return arr
    }
}

module.exports = {
    ListNode
}