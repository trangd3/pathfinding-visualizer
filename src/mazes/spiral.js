/**
 * Creates a spiral of walls on the grid.
 *
 * @param {*} grid The board of nodes.
 * @returns the walls in order of animation.
 */
export function spiral(grid) {
  const wallsInOrder = [];
  let gap = 4; // Gap of 3, plus 1 for wall.
  let firstRow = 0,
    lastRow = grid.length - 1 + gap,
    firstCol = -gap,
    lastCol = grid[0].length - 1 + gap;

  while (lastRow > firstRow && lastCol > firstRow) {
    lastCol -= gap;
    for (let col = Math.max(firstCol, 0); col <= lastCol; col++) {
      wallsInOrder.push(grid[firstRow][col]);
    }
    lastRow -= gap;
    for (let row = firstRow + 1; row <= lastRow; row++) {
      wallsInOrder.push(grid[row][lastCol]);
    }
    firstCol += gap;
    for (let col = lastCol - 1; col >= firstCol; col--) {
      wallsInOrder.push(grid[lastRow][col]);
    }
    firstRow += gap;
    for (let row = lastRow - 1; row >= firstRow; row--) {
      wallsInOrder.push(grid[row][firstCol]);
    }
  }

  return wallsInOrder;
}
