/**
 * Creates a zigzag of walls on the grid.
 *
 * @param {*} grid The board of nodes.
 * @returns the walls in order of animation.
 */
export function zigzag(grid) {
  const wallsInOrder = [];
  let direction = -1; // zigzag goes up first
  let row = Math.floor(Math.random() * grid.length); // random starting row

  for (let col = 0; col < grid[0].length; col++) {
    direction = row === 0 ? 1 : row === grid.length - 1 ? -1 : direction;
    wallsInOrder.push(grid[row][col]);
    row += direction;
  }
  return wallsInOrder;
}
