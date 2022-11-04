export function getNeighbors(node, grid) {
  const neighbors = [];
  const possibleNeighbors = [
    [node.row + 2, node.col],
    [node.row - 2, node.col],
    [node.row, node.col + 2],
    [node.row, node.col - 2],
  ];

  for (let i = 0; i < possibleNeighbors.length; i++) {
    let [row, col] = possibleNeighbors[i];

    // If node is in bounds.
    if (grid.length > row && row >= 0 && grid[0].length > col && col >= 0) {
      neighbors.push(grid[row][col]);
    }
  }
  return neighbors;
}

export function getFilteredNeighbors(node, grid, f) {
  return getNeighbors(node, grid).filter(f);
}

export function getRandomNeighbor(node, grid, f) {
  let neighbors = getNeighbors(node, grid);
  if (f) neighbors = neighbors.filter(f);
  return neighbors[Math.floor(Math.random() * neighbors.length)];
}

export function getWallBetween(node1, node2, grid) {
  // Either the same row or the same column.
  // The wall between can be min-value + 1 or max-value - 1.
  return node1.row === node2.row
    ? grid[node1.row][Math.min(node1.col, node2.col) + 1]
    : grid[Math.min(node1.row, node2.row) + 1][node1.col];
}
