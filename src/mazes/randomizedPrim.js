import { getFilteredNeighbors, getRandomNeighbor, getWallBetween } from "./helper";
export function randomizedPrim(grid) {
  const newGrid = grid.slice();

  let row = Math.floor(Math.random() * newGrid.length);
  let col = Math.floor(Math.random() * newGrid[0].length);
  /**
   * Has the weirdest bug where if row and col are both the same
   * parity of the start/end node, then it will basically make its own
   * tree, unconnected from the main tree created from prim's algo.
   */
  let node = newGrid[row][col];
  node.isWall = false;

  const frontiersList = [node];
  const wallsInOrder = [node];
  let frontierFilter = (n) => (n.isStart || n.isFinish || n.isWall) && !n.isVisited;
  let neighborFilter = (n) => !n.isWall && n.isVisited;
  let frontiers;

  while (frontiersList.length) {
    frontiers = getFilteredNeighbors(node, newGrid, frontierFilter);
    for (const frontier of frontiers) {
      frontiersList.push(frontier);
      frontier.isVisited = true;
    }

    let randomIdx = Math.floor(Math.random() * frontiersList.length);
    node = frontiersList[randomIdx];
    let neighbor = getRandomNeighbor(node, newGrid, neighborFilter);
    if (neighbor) {
      wallsInOrder.push(getWallBetween(node, neighbor, newGrid));
      neighbor.isWall = false;
    }
    wallsInOrder.push(node);
    node.isWall = false;

    frontiersList.splice(randomIdx, 1);
  }

  return wallsInOrder;
}
