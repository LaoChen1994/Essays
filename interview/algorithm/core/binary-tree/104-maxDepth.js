const { Node, BinarySearchTree } = require("./index")

/**
 * @param {Node} root
 * @return {number}
 */
var maxDepth = function(root) {
    if (root === null) {
        return 0
    }

    /**
     * 
     * @param {Node} node 
     */
    function traverse (node, depth) {
        if (node === null) {
            return depth
        }

       return Math.max(traverse(node.left, depth + 1), traverse(node.right, depth + 1))
    }

    return traverse(root, 0)
};

const tree = BinarySearchTree.getTreeFromArray([3,9,20,null,null,15,7])

console.log(maxDepth(tree))