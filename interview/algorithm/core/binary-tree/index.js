class Node {
  constructor (val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  /**
   * 
   * @param {number[]} nums
   * @returns {Node}
   */
  static getTreeFromArray (nums) {
    const len = nums.length;
    nums.unshift(0)
    if (len === 0) return null

    const root = insertRoot(1)

    /**
     * 
     * @param {Node} node 
     * @param {number} idx 
     * @returns 
     */
    function insertRoot (idx) {
      while (idx > len) {
        return null
      }

      if (nums[idx] === null) {
        return null
      }

      const node = new Node(nums[idx])
      node.left = insertRoot(2*idx)
      node.right = insertRoot(2 * idx+1)

      return node
    }

    return root
  }
}

const keys = [8, 3, 10, 1, 6, 14, 4, 7, 13];

const demoTree = BinarySearchTree.getTreeFromArray(keys)

module.exports = {
    demoTree,
    Node,
    BinarySearchTree
}
