import { getUnvisitedNeighbors, setPreviousNode, sortNodes, updateNeighbors } from "./helper";

/**
 * Performs Dijkstra's algorithm, using a queue-like sorted array
 * to hold the next closest nodes. Not using priority queues
 * because they don't stable sort, so it looks ugly.
 *
 * @param {*} grid The board of nodes.
 * @param {*} startNode The node where the algorithm starts.
 * @param {*} finishNode The node where the algorithm ends.
 * @returns the visited nodes in the order they were visited.
 */
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
