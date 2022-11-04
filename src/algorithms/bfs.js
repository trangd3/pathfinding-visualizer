import { getUnvisitedNeighbors, setPreviousNode } from "./helper";

export function bfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queue = [startNode];

  while (queue.length) {
    let node = queue.shift();
    if (node.isWall) continue; // Skips wall nodes.

    if (!node.isVisited) {
      node.isVisited = true;
      visitedNodesInOrder.push(node);
      if (node === finishNode) return visitedNodesInOrder;
      let neighbors = getUnvisitedNeighbors(node, grid);
      setPreviousNode(node, neighbors);
      queue.push(...neighbors);
    }
  }
  return visitedNodesInOrder; // End is unreachable.
}
