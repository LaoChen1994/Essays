const { demoTree, BinarySearchTree } = require("./index")

/**
 * 
 * @param {BinarySearchTree} tree
 */
function postorder (tree) {
    let res = []

    /**
     * 
     * @param {BinarySearchTree} subtree 
     */
    function traverse (subtree) {
        if (subtree === null) {
            return;
        }

        traverse(subtree.left)
        traverse(subtree.right)
        res.push(subtree.val)
    }

    traverse(tree)
    
    return res
}

console.log(postorder(demoTree))