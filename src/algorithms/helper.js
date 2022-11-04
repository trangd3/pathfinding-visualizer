/**
 * Finds all unvisited and in-bounds neighbors of node.
 * Pushes in order of top, bottom, left, to right.
 *
 * @param {*} node The node to check for neighbors.
 * @param {*} grid The board of nodes.
 * @returns all unvisited neighbors of node.
 */
export function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

/**
 * Sets all neighbors' previousNode to current node.
 *
 * @param {*} node The previous node of the neighbors.
 * @param {*} neighbors The array of neighbor nodes.
 */
export function setPreviousNode(node, neighbors) {
  for (const neighbor of neighbors) {
    neighbor.previousNode = node;
  }
}

/**
 * Sorts the nodes based on the filter given.
 *
 * @param {*} nodes The array of nodes to sort.
 * @param {*} f The filter used to sort the nodes.
 */
export function sortNodes(nodes, f) {
  nodes.sort(f);
}

/**
 * Updates the neighbors' distance.
 * @param {*} node The node we're using to update the distance.
 * @param {*} neighbors The neighbor nodes that are being updated.
 */
export function updateNeighbors(node, neighbors) {
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
  }
}
