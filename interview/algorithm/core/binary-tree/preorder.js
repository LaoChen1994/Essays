const { demoTree } = require("./index")

function preorder (tree) {
    let res = []

    function traverse (root) {
        if (root === null) {
            return
        }

        res.push(root.key)
        traverse(root.left)
        traverse(root.right)
    }

    traverse(tree)

    return res
}

// 分解算法
function maxLength2 (tree) {
    if (tree === null) {
        return 0
    }

    const leftLen = maxLength2(tree.left)
    const rightLen = maxLength2(tree.right)

    return Math.max(leftLen, rightLen) + 1
}

// 遍历求解
function maxLength (tree) {
    let maxDepth = 0, depth = 0

    function traverse (root) {
        if (root === null) {
            maxDepth = Math.max(maxDepth, depth)
            return
        }

        depth++
        traverse(root.left)
        traverse(root.right)
        depth--
    }

    traverse(tree)

    return maxDepth
}

console.log(preorder(demoTree))
console.log(maxLength(demoTree))
console.log(maxLength2(demoTree))
