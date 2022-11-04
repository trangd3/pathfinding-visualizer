import React, { Component } from "react";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";
import { dijkstra } from "./algorithms/dijkstra";
import { aStar } from "./algorithms/aStar";
import { bfs } from "./algorithms/bfs";
import { dfs } from "./algorithms/dfs";
import { greedy } from "./algorithms/greedy";

import { spiral } from "./mazes/spiral";
import { zigzag } from "./mazes/zigzag";
import { random } from "./mazes/random";
import { rb } from "./mazes/recursiveBacktracker";
import { rd } from "./mazes/recursiveDivision";
import { randomizedPrim } from "./mazes/randomizedPrim";

import "./App.css";

// MAKE SURE TO PUT IN THE FUNCTIONS IN THIS ARRAY
// Order of algorithms affects what number the buttons pass in
let ALGORITHMS = [dijkstra, aStar, bfs, dfs, greedy];
let MAZES = [spiral, zigzag, random, rb, rd, randomizedPrim];
let NUM_ROWS = 25,
  NUM_COLS = 50;
let START_NODE_ROW = 10,
  START_NODE_COL = 10,
  FINISH_NODE_ROW = 10,
  FINISH_NODE_COL = 40;
let startNode = {
  row: START_NODE_ROW,
  col: START_NODE_COL,
};
let finishNode = {
  row: FINISH_NODE_ROW,
  col: FINISH_NODE_COL,
};
let draggingStart = false,
  draggingFinish = false;
let START = "START",
  FINISH = "FINISH",
  WALL = "WALL";
let lastIndex = -1;

export default class App extends Component {
  state = {
    grid: [],
    mouseIsPressed: false,
    keyPressed: null,
  };

  getWindowSize() {
    NUM_ROWS = Math.floor(window.innerHeight / 33 - 1);
    NUM_COLS = Math.floor(document.getElementById("gridContent").clientWidth / 33);
    START_NODE_ROW = Math.floor(NUM_ROWS / 2);
    START_NODE_COL = Math.floor(NUM_COLS / 4);
    FINISH_NODE_ROW = Math.floor(NUM_ROWS / 2);
    FINISH_NODE_COL = Math.floor((NUM_COLS / 4) * 3);
    startNode.row = START_NODE_ROW;
    startNode.col = START_NODE_COL;
    finishNode.row = FINISH_NODE_ROW;
    finishNode.col = FINISH_NODE_COL;
  }

  getInitialGrid = () => {
    let grid = [];
    // for (let row = NUM_ROWS - 1; row >= 0; row--) {
    for (let row = 0; row < NUM_ROWS; row++) {
      let currentRow = [];
      for (let col = 0; col < NUM_COLS; col++) {
        currentRow.push(this.createNode(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createNode = (row, col) => {
    return {
      row,
      col,
      distance: Infinity,
      heuristic: Math.abs(row - finishNode.row) + Math.abs(col - finishNode.col),
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  componentDidMount() {
    this.getWindowSize();
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  // mouse is pressed and not lifted up
  handleMouseDown = (row, col) => {
    if (row === startNode.row && col === startNode.col) {
      const newGrid = this.getNewGridWithNodeToggled(this.state.grid, row, col, START);
      // we don't want to create walls when we are dragging the start/finish node
      // mouseIsPressed is set to false so that onMouseEnter doesn't trigger
      this.setState({ grid: newGrid, mouseIsPressed: false });
      draggingStart = true;
    } else if (row === finishNode.row && col === finishNode.col) {
      const newGrid = this.getNewGridWithNodeToggled(this.state.grid, row, col, FINISH);
      this.setState({ grid: newGrid, mouseIsPressed: false });
      draggingFinish = true;
    } else {
      this.clearPath();
      const newGrid = this.getNewGridWithNodeToggled(this.state.grid, row, col, WALL);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  };

  // create walls when mouse clicked and dragged
  // doesn't work when we clicked from start/finish because we set mouseIsPressed to false
  handleMouseEnter = (row, col) => {
    if (!this.state.mouseIsPressed) return;
    if (
      !(
        (row === startNode.row && col === startNode.col) ||
        (row === finishNode.row && col === finishNode.col)
      )
    ) {
      const newGrid = this.getNewGridWithNodeToggled(this.state.grid, row, col, WALL);
      this.setState({ grid: newGrid });
    }
  };

  // when pressed mouse button is released
  handleMouseUp = (row, col) => {
    let type = draggingStart ? START : draggingFinish ? FINISH : null;

    // only runs if we were dragging start or finish node around
    if (type) {
      const newGrid = this.getNewGridWithNodeToggled(this.state.grid, row, col, type);
      this.setState({ grid: newGrid });

      if (draggingFinish) {
        this.updateHeuristic();
      }

      if (lastIndex !== -1) {
        this.clearPath();
        const { grid } = this.state;
        const start = grid[startNode.row][startNode.col];
        const finish = grid[finishNode.row][finishNode.col];
        let visitedNodesInOrder = ALGORITHMS[lastIndex](grid, start, finish);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
        for (let node of visitedNodesInOrder) {
          if (!(node.isStart || node.isFinish)) {
            document.getElementById(`node-${node.row}-${node.col}`).className = "node node-visited";
          }
        }
        for (let node of nodesInShortestPathOrder) {
          if (!(node.isStart || node.isFinish)) {
            document.getElementById(`node-${node.row}-${node.col}`).className = "node node-shortest-path";
          }
        }
      }
    }
    this.setState({ mouseIsPressed: false });
    draggingStart = false;
    draggingFinish = false;
  };

  /**
   * Calculates the Manhattan distance to finishNode.
   */
  updateHeuristic() {
    for (const row of this.state.grid) {
      for (const node of row) {
        node.heuristic = Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
      }
    }
  }

  // changes specified node based on what node type is toggled (start, finish, wall nodes)
  getNewGridWithNodeToggled = (grid, row, col, type) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    let newNode;

    if (type === START) {
      startNode.row = row;
      startNode.col = col;
      newNode = {
        ...node,
        isStart: !node.isStart,
        isWall: false,
      };
    } else if (type === FINISH) {
      finishNode.row = row;
      finishNode.col = col;
      newNode = {
        ...node,
        isFinish: !node.isFinish,
        isWall: false,
      };
    } else if (type === WALL) {
      newNode = {
        ...node,
        isWall: !node.isWall,
      };
    }

    // have to add because of a small bug
    if (!newNode.isWall) {
      document.getElementById(`node-${row}-${col}`).classList.remove("node-wall");
    }

    newGrid[row][col] = newNode;
    return newGrid;
  };

  // resets all nodes
  clearBoard = () => {
    const { grid } = this.state;
    const newGrid = grid.slice();
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        const element = document.getElementById(`node-${i}-${j}`);
        element.classList.remove("node-visited");
        element.classList.remove("node-shortest-path");
        //clearing class node-wall is optional(working fine otherwise also)
        element.classList.remove("node-wall");
        newGrid[i][j].isVisited = false;
        newGrid[i][j].distance = Infinity;
        newGrid[i][j].isWall = false;
        newGrid[i][j].previousNode = null;
      }
    }
    this.setState({ grid: newGrid });
  };

  // resets all nodes except walls
  clearPath = () => {
    const { grid } = this.state;
    const newGrid = grid.slice();
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        const element = document.getElementById(`node-${i}-${j}`);
        element.classList.remove("node-visited");
        element.classList.remove("node-shortest-path");
        newGrid[i][j].isVisited = false;
        newGrid[i][j].distance = Infinity;
        newGrid[i][j].previousNode = null;
      }
    }
    this.setState({ grid: newGrid });
  };

  setWalls = () => {
    const { grid } = this.state;
    const newGrid = grid.slice();
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        const element = document.getElementById(`node-${i}-${j}`);
        if (!(newGrid[i][j].isStart || newGrid[i][j].isFinish)) {
          element.className = "node node-wall";
          newGrid[i][j].isWall = true;
        }
        newGrid[i][j].isVisited = false;
      }
    }
    this.setState({ grid: newGrid });
  };

  setGrid = (disabled) => {
    let type = disabled ? "none" : "auto";
    const { grid } = this.state;
    for (const row of grid) {
      for (const node of row) {
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        element.style.pointerEvents = type;
      }
    }
  };

  setButtons = (disabled) => {
    const buttons = document.getElementsByClassName("btn");
    for (let k = 0; k < buttons.length; k++) {
      buttons[k].disabled = disabled;
    }
  };

  visualize(index) {
    this.clearPath();
    this.setButtons(true);
    this.setGrid(true);

    const { grid } = this.state;
    const start = grid[startNode.row][startNode.col];
    const finish = grid[finishNode.row][finishNode.col];
    let visitedNodesInOrder = ALGORITHMS[index](grid, start, finish);
    lastIndex = index;
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!(node.isStart || node.isFinish)) {
          document.getElementById(`node-${node.row}-${node.col}`).className = "node node-visited";
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!(node.isStart || node.isFinish)) {
          document.getElementById(`node-${node.row}-${node.col}`).className = "node node-shortest-path";
        }
        if (i === nodesInShortestPathOrder.length - 1) {
          this.setButtons(false);
          this.setGrid(false);
        }
      }, 40 * i);
    }
  }

  generateMaze(index) {
    this.setButtons(true);
    this.setGrid(true);
    lastIndex = -1;

    const { grid } = this.state;
    if (index === 3 || index === 5) {
      this.setWalls();
      let wallsInOrder = MAZES[index](grid);
      this.removeWalls(wallsInOrder);
    } else {
      this.clearBoard();
      let wallsInOrder = MAZES[index](grid);
      this.animateMaze(wallsInOrder);
    }
  }

  removeWalls(wallsInOrder) {
    const { grid } = this.state;
    const newGrid = grid.slice();
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        if (!(newGrid[i][j].isStart || newGrid[i][j].isFinish || newGrid[i][j].isWall)) {
          newGrid[i][j].isWall = true;
          document.getElementById(`node-${i}-${j}`).className = "node node-wall";
        }
        newGrid[i][j].isVisited = false;
      }
    }
    setTimeout(() => {
      this.setState({ grid: newGrid });
    }, 30);

    for (let i = 0; i <= wallsInOrder.length; i++) {
      if (i === wallsInOrder.length) {
        this.setButtons(false);
        this.setGrid(false);
        this.setState({ grid: newGrid });
      } else {
        setTimeout(() => {
          const node = wallsInOrder[i];
          const { row, col } = node;
          if (!(node.isStart || node.isFinish)) {
            newGrid[row][col].isWall = false;
            newGrid[row][col].isVisited = false;
            newGrid[row][col].distance = Infinity;
            newGrid[row][col].previousNode = null;
            document.getElementById(`node-${row}-${col}`).className = "node";
          }
        }, 10 * i);
      }
    }
  }

  animateMaze(wallsInOrder) {
    const { grid } = this.state;
    const newGrid = grid.slice();
    for (let i = 0; i <= wallsInOrder.length; i++) {
      if (i === wallsInOrder.length) {
        this.setButtons(false);
        this.setGrid(false);
        this.setState({ grid: newGrid });
      } else {
        setTimeout(() => {
          const node = wallsInOrder[i];
          const { row, col } = node;
          if (!(node.isStart || node.isFinish)) {
            newGrid[row][col].isWall = true;
            document.getElementById(`node-${row}-${col}`).className = "node node-wall";
          }
        }, 10 * i);
      }
    }
  }

  render() {
    return (
      <div>
        <div className="App" id="mainContent">
          <div id="gridContent">
            <PathfindingVisualizer
              grid={this.state.grid}
              mouseIsPressed={this.state.mouseIsPressed}
              handleMouseUp={(row, col) => this.handleMouseUp(row, col)}
              handleMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
              handleMouseDown={(row, col) => this.handleMouseDown(row, col)}
            />
          </div>
          <button type="button" className="btn btn-danger" onClick={() => this.clearBoard()}>
            Clear Board
          </button>
          <button type="button" className="btn btn-danger" onClick={() => this.clearPath()}>
            Clear Path
          </button>
          <button type="button" className="btn btn-primary" onClick={() => this.visualize(0)}>
            Dijkstra's
          </button>
          <button type="button" className="btn btn-primary" onClick={() => this.visualize(1)}>
            A*
          </button>
          <button type="button" className="btn btn-primary" onClick={() => this.visualize(2)}>
            BFS
          </button>
          <button type="button" className="btn btn-primary" onClick={() => this.visualize(3)}>
            DFS
          </button>
          <button type="button" className="btn btn-primary" onClick={() => this.visualize(4)}>
            Greedy
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => this.generateMaze(0)}>
            Spiral Walls
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => this.generateMaze(1)}>
            Zigzag Walls
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => this.generateMaze(2)}>
            Random Walls
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => this.generateMaze(3)}>
            Recursive Backtracking Maze
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => this.generateMaze(4)}>
            Recursive Division Maze
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => this.generateMaze(5)}>
            Randomized Prim's Maze
          </button>
        </div>
      </div>
    );
  }
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called after the pathfinding methods.
function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
