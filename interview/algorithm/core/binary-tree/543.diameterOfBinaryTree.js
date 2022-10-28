const { Node, BinarySearchTree } = require("./index");

/**
 * @param {Node} root
 * @return {number}
 */
var diameterOfBinaryTree = function (root) {
  let max = 0;
  /**
   *
   * @param {Node} root
   * @return {number}
   */
  function traverse(node) {
    if (node === null) {
      return 0
    }

    const left = traverse(node.left)
    const right = traverse(node.right)

    // 目的是为了获取某个节点左右子树节点之和
    max = Math.max(max, left + right + 1)

    // 对于上一级子树来说，希望拿到这个分支最大的节点数
    return Math.max(left, right)
  }

  traverse(root);

  return max;
};

const node = BinarySearchTree.getTreeFromArray(
  [4,-7,-3,null,null,-9,-3,9,-7,-4,null,6,null,-6,-6,null,null,0,6,5,null,9,null,null,-1,-4,null,null,null,-2]
);

console.log(diameterOfBinaryTree(node));
