export function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

export function setPreviousNode(node, neighbors) {
  for (const neighbor of neighbors) {
    neighbor.previousNode = node;
  }
}

export function sortNodes(nodes, f) {
  nodes.sort(f);
}

export function updateNeighbors(node, neighbors) {
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
  }
}
