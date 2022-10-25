const { demoTree, BinarySearchTree } = require("./index")

function midorder (tree) {
    let res = [];

    /**
     * 
     * @param {BinarySearchTree} node 
     */
    function traverse(node) {
        if (node === null) {
            return
        }

        traverse(node.left)
        res.push(node.val)
        traverse(node.right)
    }

    traverse(tree)

    return res
}

console.log(midorder(demoTree))