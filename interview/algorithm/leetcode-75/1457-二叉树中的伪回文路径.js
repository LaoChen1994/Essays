const {BinarySearchTree} = require('../core/binary-tree')

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var pseudoPalindromicPaths  = function(root) {

};


/**
 * @param {TreeNode} node
 * @param {Function} cb
 */
function traverse(node, cb) {
    if (node === null) return;
    console.log(node.val);

    traverse(node.left, cb);

    traverse(node.right, cb);
}

traverse(BinarySearchTree.getTreeFromArray([2,3,1,3,1,null,1]))
