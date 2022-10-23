import "./Game.css";
import React from "react";
function Square(props) {
  const handleClick = () => {
    props.onClick();
  };

  return (
    <button className={`square ${props.active}`} onClick={handleClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, position, lineWinner) {
    const active = () => {
      if (lineWinner && lineWinner.indexOf(i) !== -1){
        return "active"
      }
      else if (i === position) return "active";
      else return "";
    };
    
    return (
      <Square
        key={i}
        id={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        active={active()}
      />
    );
  }

  render() {
    let board = Array(3).fill(Array(3).fill(null));
    let lineWinner = undefined;
    if (this.props.lineWinner) lineWinner = this.props.lineWinner.line;

    return board.map((row, indexRow) => {
      return (
        <div key={indexRow} className="board-row">
          {row.map((col, indexCol) =>
            this.renderSquare(
              indexRow * 3 + indexCol,
              this.props.position,
              lineWinner
            )
          )}
        </div>
      );
    });
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReverseSort: false,
      history: [
        {
          squares: Array(9).fill(null),
          position: -1,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      ...this.state,
      history: history.concat({ squares, position: i }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${move} (${Math.floor(step.position / 3)}, ${
            step.position % 3
          })`
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else if (current.squares.indexOf(null) === -1) {
      status = "DRAW RESULT";
    }
    else  {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i);
            }}
            lineWinner={winner}
            position={current.position}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {this.state.isReverseSort || <ol>{moves}</ol>}
          {this.state.isReverseSort && <ol>{moves.reverse()}</ol>}
          <button
            className="btn-reverse"
            onClick={() =>
              this.setState({
                ...this.state,
                isReverseSort: !this.state.isReverseSort,
              })
            }
          >
            Reverse
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default Game;
