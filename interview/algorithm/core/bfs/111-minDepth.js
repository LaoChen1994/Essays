function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.right = right === undefined ? null : right;
  this.left = left === undefined ? null : left
}
/**
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function (root) {
    let queue = []
    let depth = 0

    queue.push(root);

    while(queue.length) {
        const len = queue.length;

        for (let i = 0; i < len; i++) {
            const node = queue.shift();

            if (node.left === null && node.right === null) {
                // 节点为空说明这个时候 
                return depth
            }
            

            if (node.left !== null) {
                queue.push(node.left)
            }

            if (node.right !== null) {
                queue.push(node.right)
            }
        }

        depth++
    }
};
