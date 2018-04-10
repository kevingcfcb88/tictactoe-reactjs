import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button className="square" onClick = { props.onClick } >
      { props.value }
    </button>
  );
}

class InvertOrder extends React.Component{

 render(){
    return (
      <button
        onClick = {() => this.props.onClick()}
      >
        {this.props.order ? 'Change to Descending':'Change to Ascending'}
      </button>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value = { this.props.squares[i] }
        onClick = { () => this.props.onClick(i) }
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history:[{
        squares: Array(9).fill(null),
        movement: null,
        selected: true,
      }],
      xIsNext: true,
      stepNumber: 0,
      order: true,      
    };
  }

  handleClick(i){
    let history = this.state.history.slice(0, this.state.stepNumber +1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    history = history.map((value,index) => {
      value.selected = false;
      return value;
    });

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ 
      history: history.concat([{ 
        squares: squares,
        movement: calculatePosition(i,this.state.xIsNext),
        selected: true,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,      
    });
  }

  jumpTo(step){
    let history = this.state.history.slice();
    history = history.map((value,index) => {
      value.selected = (index === step ? true : false);
      return value;
    });
    this.setState({
      history: history,
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
  changeOrder(){
    this.setState({
      order: this.state.order ? false : true,
    });    
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move # ${move} ${step.movement}`:
        'Go to game start';
      const sCurrent = (step.selected ? "selectedMovement" : null);
      return (
        <li key={move}>
          <button
            className={sCurrent}
            onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = { current.squares }
            onClick = { (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.order ? moves : moves.reverse()}</ol>
        </div>
        <div className="game-info">
          <div>
            <InvertOrder 
              order = {this.state.order}
              onClick = {() => this.changeOrder()}
            />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

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
      return squares[a];
    }
  }
  return null;
}

function calculatePosition(pos,xIsNext){
  const aPositions = [
    'C1F1','C2F1','C3F1',
    'C1F2','C2F2','C3F2',
    'C1F3','C2F3','C3F3'
  ]
  const sValue = xIsNext ? 'X' : '0';
  return `${aPositions[pos]} => ${sValue}`;
}