// Każda żyjąca komórka z mniej niż 2 zyjącymi sąsiadami umiera
// Każda zyjąca komórka z 2 lub 3 żyjącymi sąsiadami przeżywa do następnego etapu
// Każda żyjąca komórka z więcej niż 3 żyjącymi sąsiadami umiera
// Jakakolwiek martwa komórka z dokładnie 3 zyjącymi sąsiadami staje się żywa

class BoardCreator {
  randomize(chancePercent) {
    let randomNumber = Math.floor(Math.random() * 100);
    if (chancePercent > randomNumber) {
      return 1;
    } else {
      return 0;
    }
  }
  rowPush(numberOfElements) {
    let row = [];
    for (let i = 0; i < numberOfElements; i++) {
      row.push(0);
    }
    return row;
  }
  emptyBoard(numberOfRows, numberOfColumns) {
    let board = [];
    for (let i = 0; i < numberOfRows; i++) {
      board.push(this.rowPush(numberOfColumns));

    }
    return board;
  }
  init(numberOfRows, numberOfColumns, chancePercent) {
    let board = this.emptyBoard(numberOfRows, numberOfColumns);
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        board[y][x] = this.randomize(chancePercent);
      }
    }
    return board;
  }
}

class CellChecker {
  createMiniBoard(board, x, y) {
    let miniBoard = [[], [], []];
    if (y - 1 > -1) {
      if (x - 1 > -1) {
        miniBoard[0].push(board[y - 1][x - 1]);
      } else {
        miniBoard[0].push(0);
      }
      //up left
      miniBoard[0].push(board[y - 1][x]);
      //up
      if (x + 1 < board[0].length) {
        miniBoard[0].push(board[y - 1][x + 1]);
      } else {
        miniBoard[0].push(0);
      }
      //up right
    } else {
      miniBoard[0].push(0); //up left
      miniBoard[0].push(0); //up
      miniBoard[0].push(0); //up right
    }
    if (x - 1 > -1) {
      miniBoard[1].push(board[y][x - 1]);
    } else {
      miniBoard[1].push(0);
    }
    //left
    if (x + 1 < board[1].length) {
      miniBoard[1].push(board[y][x + 1]);
    } else {
      miniBoard[1].push(0);
    }
    //right
    if (y + 1 < board.length) {
      if (x - 1 > -1) {
        miniBoard[2].push(board[y + 1][x - 1]);
      } else {
        miniBoard[2].push(0);
      }
      //down left
      miniBoard[2].push(board[y + 1][x]);
      //down
      if (x + 1 < board[2].length) {
        miniBoard[2].push(board[y + 1][x + 1]);
      } else {
        miniBoard[2].push(0);
      }
      //down right
    } else {
      miniBoard[2].push(0); //down left
      miniBoard[2].push(0); //down
      miniBoard[2].push(0); //down right
    }
    return miniBoard;
  }
  neigbourCount(miniBoard) {
    let livingCells = 0;
    for (let y = 0; y < miniBoard.length; y++) {
      for (let x = 0; x < miniBoard[y].length; x++) {
        if (miniBoard[y][x] === 1) {
          livingCells++;
        }
      }
    }
    return livingCells;
  }
  init(board, x, y) {
    return this.neigbourCount(this.createMiniBoard(board, x, y));
  }
}

class Draw {
  blank(canvasId) {
    const xSize = 1000;
    const ySize = 650;
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, xSize, ySize); // clears pixels to set them transparent black
  }
  grid(numberOfRows, numberOfColumns, canvasId) {
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext("2d");
    let size = 25;

    for (let x = 0; x < numberOfColumns; x++) {
      ctx.beginPath();
      ctx.moveTo(size * x, 0);
      ctx.lineTo(size * x, 650);
      ctx.strokeStyle = "darkgreen";
      ctx.stroke();
    } //vertical lines

    for (let y = 0; y < numberOfRows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, size * y);
      ctx.lineTo(1000, size * y);
      ctx.strokeStyle = "darkgreen";
      ctx.stroke();
    } //horizontal lines
  }
  content(board, canvasId) {
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext("2d");
    let size = 25;
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x] === 1) {
          ctx.rect(x * size, y * size, size, size);
          ctx.fillStyle = "darkgreen";
          ctx.fill();
        }
      }
    }
  }
}

class App {                                               
  constructor(numberOfRows, numberOfColumns, canvasId) {
    this.rows = numberOfRows;
    this.columns = numberOfColumns;
    this.boardCreator = new BoardCreator();
    this.cellChecker = new CellChecker();
    this.draw = new Draw();
    this.currentBoard = this.boardCreator.init(this.rows, this.columns, 33);
    this.canvasId = canvasId;
  }
  nextGeneration() {
    let nextBoard = this.boardCreator.emptyBoard(this.rows, this.columns, 0);
    for (let y = 0; y < this.currentBoard.length; y++) {
      for (let x = 0; x < this.currentBoard[y].length; x++) {
        let numberOfLivingCells = this.cellChecker.init(
          this.currentBoard,
          x,
          y
        );
        let currentCell = this.currentBoard[y][x];
        if (currentCell) {
          if (numberOfLivingCells < 2 || numberOfLivingCells > 3) {
            nextBoard[y][x] = 0;
          } else {
            nextBoard[y][x] = 1;
          }
        } else {
          if (numberOfLivingCells === 3) {
            nextBoard[y][x] = 1;
          } else {
            nextBoard[y][x] = 0;
          }
        }
      }
    }
    this.currentBoard = nextBoard;
  }
  reset() {
    this.currentBoard = this.boardCreator.init(this.rows, this.columns, 33);
  }
  init() {
    this.draw.blank(this.canvasId);
    this.draw.content(this.currentBoard, this.canvasId);
    this.draw.grid(26, 40, this.canvasId);
    this.nextGeneration();
  }
  startGame(){
    setInterval( () => app.init(), 500);
  }
}



const app = new App(26, 40, "board");
