import { getUnvisitedNeighbors, setPreviousNode, sortNodes } from "./helper";

/**
 * Performs Greedy Best-First Search algorithm, using a
 * queue-like sorted array based on Manhattan distance
 * to finishNode to hold the next closest nodes.
 *
 * @param {*} grid The board of nodes.
 * @param {*} startNode The node where the algorithm starts.
 * @param {*} finishNode The node where the algorithm ends.
 * @returns the visited nodes in the order they were visited.
 */
export function greedy(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queue = [startNode];

  while (queue.length) {
    sortNodes(queue, (a, b) => a.heuristic - b.heuristic);
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
  return visitedNodesInOrder;
}
