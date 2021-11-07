const friends = {
  Alice: ["Bob", "Diana", "Fred"],
  Bob: ["Alice", "Cynthia", "Diana"],
  Cynthia: ["Bob"],
  Diana: ["Alice", "Bob", "Fred"],
  Elise: ["Fred"],
  Fred: ["Alice", "Diana", "Elise"]
}


function breadthFirst (graph, startNode) {
  let rlt = [startNode];
  let restNode = [startNode]

  while(restNode.length) {
    const nextNode = restNode.shift()

    if (!graph[nextNode]) continue

    (graph[nextNode] || []).forEach(item => {
      if (rlt.includes(item)) return;

      rlt.push(item)
      restNode.push(item)
    })
  }

  return rlt
}

console.log(breadthFirst(friends, 'Alice'))