// [EXAM easyBoard] Create bouncy simulator. Get board from ExampleInput.js. X – border, 0 – boards object can travel, 
// 1 – bouncing object. The program is to show how the object would travel and bounce against the walls. 
// The program is to end when object comes back to original position. 

// [EXAM hardBoard] Create bouncy simulator. Get board from ExampleInput.js. Y – when bouncing objects enters it move 
// it to random direction other that it came and Y turns into 0,    X – border, 0 – boards object can travel,
//  1 – bouncing object. The program is to show how the object would travel and bounce against the walls.
// Bouncing objects starts in any corner. 1 and Y position may vary. 


const easyBoard = require('./ExamInput');
const hardBoard = require('./ExamInputBig');

  class Vector {
    upLeft(position, board) {
      let x = position[0] - 1;
      let y = position[1] - 1;
      if (board[y][x]) {
        return [x, y];
      } else {
        return false;
      }
    }
    upRight(position, board) {
      let x = position[0] + 1;
      let y = position[1] - 1;
      if (board[y][x]) {
        return [x, y];
      } else {
        return false;
      }
    }
    downLeft(position, board) {
      let x = position[0] - 1;
      let y = position[1] + 1;
      if (board[y][x]) {
        return [x, y];
      } else {
        return false;
      }
    }
    downRight(position, board) {
      let x = position[0] + 1;
      let y = position[1] + 1;
      if (board[y][x]) {
        return [x, y];
      } else {
        return false;
      }
    }
    randomDirection(direction) {
      let possibleDirections;
      if (direction === this.downRight) {
        possibleDirections = [this.upRight, this.downLeft, this.downRight];
      } else if (direction === this.downLeft) {
        possibleDirections = [this.upLeft, this.downLeft, this.downRight];
      } else if (direction === this.upRight) {
        possibleDirections = [this.upLeft, this.upRight, this.downRight];
      } else if (direction === this.upLeft) {
        possibleDirections = [this.upLeft, this.upRight, this.downLeft];
      }
      let randomizer = Math.floor(Math.random() * possibleDirections.length);
      return possibleDirections[randomizer];
    }
  }
  
  class WallDetector {
    findWalls(board, position) {
      let y = position[1];
      let x = position[0];
      let wall = {
        up: false,
        down: false,
        left: false,
        right: false
      };
      if (board[y][x - 1] === "X") {
        wall.left = true;
      }
      if (board[y - 1][x] === "X") {
        wall.up = true;
      }
      if (board[y][x + 1] === "X") {
        wall.right = true;
      }
      if (board[y + 1][x] === "X") {
        wall.down = true;
      }
      return wall;
    }
    findCorners(board, position) {
      let y = position[1];
      let x = position[0];
      let corner = {
        upRight: false,
        upLeft: false,
        downLeft: false,
        downRight: false
      };
      if (
        board[y - 1][x + 1] === "X" &&
        board[y - 1][x] !== "X" &&
        board[y][x + 1] !== "X"
      ) {
        corner.upRight = true;
      }
      if (
        board[y - 1][x - 1] === "X" &&
        board[y - 1][x] !== "X" &&
        board[y][x - 1] !== "X"
      ) {
        corner.upLeft = true;
      }
      if (
        board[y + 1][x - 1] === "X" &&
        board[y + 1][x] !== "X" &&
        board[y][x - 1] !== "X"
      ) {
        corner.downLeft = true;
      }
      if (
        board[y + 1][x + 1] === "X" &&
        board[y + 1][x] !== "X" &&
        board[y][x + 1] !== "X"
      ) {
        corner.downRight = true;
      }
      return corner;
    }
    run(board, position) {
      let wall = this.findWalls(board, position);
      let corner = this.findCorners(board, position);
      let result = Object.assign(corner, wall);
      return result;
    }
  }
  
  class PositionFinder {
    run(board) {
      for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
          if (board[y][x] === "1") {
            return [x, y];
          }
        }
      }
    }
  }
  
  class App {
    constructor(board) {
      this.vector = new Vector();
      this.wall = new WallDetector();
      this.positionFinder = new PositionFinder();
      this.board = board;
      this.currentVector = this.vector.downRight;
      this.position = this.positionFinder.run(this.board);
      this.finishCondition = this.positionFinder.run(this.board);
    }
    bounce() {
      let bounce = this.wall.run(this.board, this.position);
      if (this.currentVector === this.vector.upLeft && bounce.upLeft) {
        this.currentVector = this.vector.downRight;
      } else if (this.currentVector === this.vector.downLeft && bounce.downLeft) {
        this.currentVector = this.vector.upRight;
      } else if (this.currentVector === this.vector.upRight && bounce.upRight) {
        this.currentVector = this.vector.downLeft;
      } else if (
        this.currentVector === this.vector.downRight &&
        bounce.downRight
      ) {
        this.currentVector = this.vector.upLeft;
      } else if (this.currentVector === this.vector.upLeft && bounce.left) {
        this.currentVector = this.vector.upRight;
      } else if (this.currentVector === this.vector.upLeft && bounce.up) {
        this.currentVector = this.vector.downLeft;
      } else if (this.currentVector === this.vector.upRight && bounce.right) {
        this.currentVector = this.vector.upLeft;
      } else if (this.currentVector === this.vector.upRight && bounce.up) {
        this.currentVector = this.vector.downRight;
      } else if (this.currentVector === this.vector.downLeft && bounce.left) {
        this.currentVector = this.vector.downRight;
      } else if (this.currentVector === this.vector.downLeft && bounce.down) {
        this.currentVector = this.vector.upLeft;
      } else if (this.currentVector === this.vector.downRight && bounce.right) {
        this.currentVector = this.vector.downLeft;
      } else if (this.currentVector === this.vector.downRight && bounce.down) {
        this.currentVector = this.vector.upRight;
      }
    }
    move() {
      let nextPosition = this.currentVector(this.position, this.board);
      if (this.board[nextPosition[1]][nextPosition[0]] === "0") {
        this.board[nextPosition[1]][nextPosition[0]] = "1";
        this.board[this.position[1]][this.position[0]] = "0";
        this.position = [nextPosition[0], nextPosition[1]];
      } else if (this.board[nextPosition[1]][nextPosition[0]] === "X") {
        console.log("Bounce!");
        this.bounce();
        this.move();
      } else if (this.board[nextPosition[1]][nextPosition[0]] === "Y") {
        this.board[nextPosition[1]][nextPosition[0]] = "1";
        this.board[this.position[1]][this.position[0]] = "0";
        this.position = [nextPosition[0], nextPosition[1]];
        this.currentVector = this.vector.randomDirection(this.currentVector);
        console.log("Y? Ups - random direction!");
      }
    }
    run(counts) {
      let moveCounter = 0;
      while (counts > moveCounter) {
        console.table(this.board);
        this.move();
        moveCounter++;
        counts--;
        if (this.position[0] === this.finishCondition[0] && this.position[1] === this.finishCondition[1]) {
          console.table(this.board);
          console.log(`Winner Winner Chicken Dinner in ${moveCounter} moves`);
          break;
        }
        else if (moveCounter == counts){
          console.log("Can't win this game :(");
        }
      }
    }
  }
  
  const app = new App(hardBoard);
  app.run(500);