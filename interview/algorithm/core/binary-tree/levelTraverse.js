const { Node, BinarySearchTree } = require("./index")

/**
 * 
 * @param {Node} node
 * @return {number[]}
 */
function levelTraverse (node) {
    let res = [], stack = []

    /**
     * 
     * @param {Node} root 
     */
    function traverse (root) {
        if (root !== null) {
            res.push(root.val);
            stack.push(root.left)
            stack.push(root.right)
        }
        
        let node = stack.shift()
        if (node !== null) {
            traverse(node)
        }
    }

    traverse(node)

    return res
}

const tree = BinarySearchTree.getTreeFromArray([1, 2, 3, 4, 5, 6, 7, 8])
console.log(levelTraverse(tree))