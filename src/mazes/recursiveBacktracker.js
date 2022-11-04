import { getRandomNeighbor, getWallBetween } from "./helper";

/**
 *
 * @param {*} grid The board of nodes.
 * @returns an array of nodes to change from walls.
 */
export function rb(grid) {
  const newGrid = grid.slice();
  let node = newGrid[0][0];
  node.isVisited = true;

  const wallsToRemove = [];
  const stack = [];
  do {
    wallsToRemove.push(node);
    let next = getRandomNeighbor(node, newGrid, (n) => !n.isVisited);
    if (next) {
      stack.push(next);
      next.isVisited = true;
      wallsToRemove.push(getWallBetween(node, next, newGrid));
      node = next;
    } else {
      node = stack.pop();
    }
  } while (stack.length);
  return wallsToRemove;
}
