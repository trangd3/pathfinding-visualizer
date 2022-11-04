import { getUnvisitedNeighbors, setPreviousNode, sortNodes, updateNeighbors } from "./helper";

export function aStar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queue = [startNode];
  startNode.distance = 0;

  while (queue.length) {
    sortNodes(queue, (a, b) => a.distance + a.heuristic - (b.distance + b.heuristic));
    let node = queue.shift();
    if (node.isWall) continue; // Skips wall nodes.

    if (!node.isVisited) {
      node.isVisited = true;
      visitedNodesInOrder.push(node);
      if (node === finishNode) return visitedNodesInOrder;
      let neighbors = getUnvisitedNeighbors(node, grid);
      setPreviousNode(node, neighbors);
      updateNeighbors(node, neighbors);
      queue.push(...neighbors);
    }
  }
  return visitedNodesInOrder;
}
