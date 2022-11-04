/**
 * Randomly adds walls on the grid.
 * About 25% of nodes will be walls.
 *
 * @param {*} grid The board of nodes.
 * @returns the walls in order of animation.
 */
export function random(grid) {
  const wallsInOrder = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (Math.floor(Math.random() * 100) < 25) {
        wallsInOrder.push(grid[row][col]);
      }
    }
  }
  return wallsInOrder;
}
