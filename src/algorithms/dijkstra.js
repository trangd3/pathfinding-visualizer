import { getUnvisitedNeighbors, setPreviousNode, sortNodes, updateNeighbors } from "./helper";

export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queue = [startNode];
  startNode.distance = 0;

  while (queue.length) {
    sortNodes(queue, (a, b) => a.distance - b.distance);
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
  return visitedNodesInOrder; // End is unreachable.
}
