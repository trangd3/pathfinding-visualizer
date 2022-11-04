import React, { Component } from "react";
import Node from "./Node/Node";

import "./PathfindingVisualizer.css";

export default class PathfindingVisualizer extends Component {
  render() {
    const { grid, mouseIsPressed } = this.props;
    return (
      <div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isVisited, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isVisited={isVisited}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseUp={(row, col) => this.props.handleMouseUp(row, col)}
                      onMouseDown={(row, col) => this.props.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.props.handleMouseEnter(row, col)}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
