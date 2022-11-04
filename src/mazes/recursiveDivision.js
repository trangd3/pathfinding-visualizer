export function rd(grid) {
  const wallsInOrder = [];
  const newGrid = grid.slice();
  // addGridEdges(grid, wallsInOrder);
  let top = 0,
    bottom = newGrid.length - 1,
    left = 0,
    right = newGrid[0].length - 1;

  divide(newGrid, top, bottom, left, right, wallsInOrder);

  return wallsInOrder;
}

// Adds the edge nodes of the grid to the array of walls
// function addGridEdges(grid, wallsInOrder) {
//   let rowLength = grid.length - 1,
//     colLength = grid[0].length - 1;
//   for (let i = 0; i < colLength; i++) {
//     wallsInOrder.push(grid[0][i]);
//   }
//   for (let i = 0; i < rowLength; i++) {
//     wallsInOrder.push(grid[i][colLength]);
//   }
//   for (let i = colLength; i > 0; i--) {
//     wallsInOrder.push(grid[rowLength][i]);
//   }
//   for (let i = rowLength; i > 0; i--) {
//     wallsInOrder.push(grid[i][0]);
//   }
// }

/**
 * Decides on the orientation of the recursive split.
 * Horizontal if the area is wider and vertical if longer.
 * If area is a square, it chooses randomly.
 *
 * @param boundaries all four are the boundaries of the area.
 * @returns either a vertical or horizontal orientation
 */
function chooseOrientation(top, bottom, left, right) {
  let width = right - left;
  let height = bottom - top;
  return width > height
    ? "Vertical"
    : height > width
    ? "Horizontal"
    : Math.random() < 0.5
    ? "Vertical"
    : "Horizontal";
}

/**
 *
 * @param {*} grid The board of nodes.
 * @param {*} top Upper boundary.
 * @param {*} bottom Lower boundary.
 * @param {*} left Left boundary.
 * @param {*} right Right boundary.
 * @param {*} wallsInOrder The walls to add to the grid.
 * @returns null;
 */
const divide = (grid, top, bottom, left, right, wallsInOrder) => {
  let width = right - left + 1;
  let height = bottom - top + 1;
  if (width < 2 || height < 2) return;

  let orientation = chooseOrientation(top, bottom, left, right);
  let firstRow = orientation === "Horizontal" ? top + 1 : top;
  let firstCol = orientation === "Horizontal" ? left : left + 1;
  let lastCol = orientation === "Horizontal" ? right : right - 1;
  let lastRow = orientation === "Horizontal" ? bottom - 1 : bottom;

  if (lastRow < firstRow || lastCol < firstCol) return;

  if (orientation === "Horizontal") {
    // choose a random row where the two halves will be split
    let wallRowIdx = Math.floor(Math.random() * (lastRow - firstRow + 1)) + firstRow;
    // randomly pick position of the connecting hole in the wall
    let hole = Math.random() < 0.5 ? left : right;

    for (let col = firstCol; col <= lastCol; col++) {
      let node = grid[wallRowIdx][col];
      if (node.isStart || node.isFinish || col === hole) {
        grid[wallRowIdx][col].isVisited = true;
      }
      if (!node.isVisited) {
        wallsInOrder.push(node);
      }
    }
    divide(grid, top, wallRowIdx - 1, left, right, wallsInOrder); // top half
    divide(grid, wallRowIdx + 1, bottom, left, right, wallsInOrder); // lower half
  } else {
    // choose a random column where the two halves will be split
    let wallColIdx = Math.floor(Math.random() * (lastCol - firstCol + 1)) + firstCol;
    // randomly pick position of the connecting hole in the wall
    let hole = Math.random() < 0.5 ? top : bottom;

    for (let row = firstRow; row <= lastRow; row++) {
      if (row === hole) {
        grid[row][wallColIdx].isVisited = true;
      } else {
        for (let col = 0; col < grid[row].length; col++) {
          if (!(grid[row][col].isStart || grid[row][col].isFinish || grid[row][col].isVisited)) {
            col === wallColIdx && wallsInOrder.push(grid[row][col]);
          }
        }
      }
    }

    divide(grid, top, bottom, left, wallColIdx - 1, wallsInOrder); // left half
    divide(grid, top, bottom, wallColIdx + 1, right, wallsInOrder); // right half
  }
};
