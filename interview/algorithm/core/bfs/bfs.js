function bfs (root, target) {
    const queue = []
    const visited = new Set();

    queue.push(root);
    visited.add(root);
    let step = 0

    while (queue.length) {
        let len = queue.length;

        for (let i = 0; i < len; i++) {
            const curr = queue.shift()

            if (curr === target) {
                return step
            }

            // 这里的adj指的是将该节点周围的所有节点都获取的方法，不一定都是adj
            for (const NODE of curr.adj()) {
                if (!visited.has(NODE)) {
                    queue.push(NODE)
                }
            }
        }

        // 到这里说明同层节点都遍历完成，所以深度+1
        step++
    }
}
