import { getUnvisitedNeighbors, setPreviousNode } from "./helper";

export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode];

  while (stack.length) {
    let node = stack.pop();
    if (node.isWall) continue; // Skips wall nodes.

    if (!node.isVisited) {
      node.isVisited = true;
      visitedNodesInOrder.push(node);
      if (node === finishNode) return visitedNodesInOrder;
      let neighbors = getUnvisitedNeighbors(node, grid);
      setPreviousNode(node, neighbors);
      stack.push(...neighbors);
    }
  }
  return visitedNodesInOrder; // End is unreachable.
}
