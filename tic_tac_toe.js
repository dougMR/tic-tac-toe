/*
    Spent hours trying to get to the bottom of why my additional features broke the game.
    Problem was I was checking if(result), but result could be 0.  I had to explicitly say
    if(result !== false).  I console logged nearly every line before I got to the bottom of it.

    So it is working, and I refactored the computerBlockOrRandomTurnRefactored function.
    And now computer looks for winning move before looking for a blocking move.  And game announces when it's a draw.

    There is still a lot of refactoring to be done.  In my last push, I wrote a lot of redundant code to get it working.

*/

let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];
let winningTiles = [];
// TODO: player choose mark
let playerMark = "X";
let computerMark = "O";

const initHTML = () => {
    // Create the board
    let buttonNum = 1;
    let html = "<div id='board'>";
    let rowNum = 0;
    let colNum = 0;
    for (const row of board) {
        html += `<div class="row">`;
        colNum = 0;
        for (const col of row) {
            // Give buttons data-row and data-col attributes for targeting them later
            html += `<div class="button" id="b${buttonNum}" data-row="${rowNum}" data-col="${colNum}"  class="${
                col ? "filled" : ""
            }" onclick="buttonClicked(event)">${
                col || "&nbsp;&nbsp;"
            }</div>`;

            buttonNum++;
            colNum++;
        }
        html += `</div>`;
        rowNum++;
    }
    html += `</div>`;
    document.getElementById("board-container").innerHTML = html;
};
const updateHTML = (isDraw) => {
    // Add marks to the HTML board, based on the board array
    // Updating existing elements rather than re-writing the html,
    // so that the marks can fade in using css transition
    let rowNum = 0;
    let colNum = 0;
    for (const row of board) {
        colNum = 0;
        for (const col of row) {
            const btn = document.querySelector(
                `.button[data-row="${rowNum}"][data-col="${colNum}"]`
            );
            btn.innerHTML = col || "&nbsp;&nbsp;";
            // 'filled' class fades in mark
            if (col) btn.classList.add("filled");
            if(isDraw){
                btn.classList.add("draw");
            }else if(winningTiles.some( indices => indices[0] === rowNum && indices[1]===colNum)){
                // This tile is part of the winning line
                btn.classList.add("winner");
            } else {
                // Remove winner style in case it was marked a winner last game
                btn.classList.remove("winner");
                // Remove draw style in case we just finished a draw game
                btn.classList.remove("draw");
            }
            colNum++;
        }
        rowNum++;
    }
};

// SOURCE: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
const randomNumBetween = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const computerRandomTurn = () => {
    // find board[row][col] that is empty
    let row, col;
    let loopTimes = 0;
    do {
        row = randomNumBetween(0, 2);
        col = randomNumBetween(0, 2);
        loopTimes++;
    } while (board[row][col] && loopTimes < 999);
    if (!board[row][col]) {
        board[row][col] = computerMark;
    }
};
/*
const computerBlockOrRandomTurn = () => {
    //check all rows
    if (
        board[0][0] === playerMark &&
        board[0][1] === playerMark &&
        board[0][2] !== computerMark
    ) {
        //top right
        board[0][2] = computerMark;
    } else if (
        board[0][1] === playerMark &&
        board[0][2] === playerMark &&
        board[0][0] !== computerMark
    ) {
        //top left
        board[0][0] = computerMark;
    } else if (
        board[0][0] === playerMark &&
        board[0][2] === playerMark &&
        board[0][1] !== computerMark
    ) {
        //top center
        board[0][1] = computerMark;
    } else if (
        board[1][0] === playerMark &&
        board[1][1] === playerMark &&
        board[1][2] !== computerMark
    ) {
        //middle right
        board[1][2] = computerMark;
    } else if (
        board[1][1] === playerMark &&
        board[1][2] === playerMark &&
        board[1][0] !== computerMark
    ) {
        //middle left
        board[1][0] = computerMark;
    } else if (
        board[1][0] === playerMark &&
        board[1][2] === playerMark &&
        board[1][1] !== computerMark
    ) {
        //middle center
        board[1][1] = computerMark;
    } else if (
        board[2][0] === playerMark &&
        board[2][1] === playerMark &&
        board[2][2] !== computerMark
    ) {
        //bottom right
        board[2][2] = computerMark;
    } else if (
        board[2][1] === playerMark &&
        board[2][2] === playerMark &&
        board[2][0] !== computerMark
    ) {
        //bottom left
        board[2][0] = computerMark;
    } else if (
        board[2][0] === playerMark &&
        board[2][2] === playerMark &&
        board[2][1] !== computerMark
    ) {
        //bottom center
        board[2][1] = computerMark; //all rows have been checked, now start all cols
    } else if (
        board[0][0] === playerMark &&
        board[1][0] === playerMark &&
        board[2][0] !== computerMark
    ) {
        //bottom left
        board[2][0] = computerMark;
    } else if (
        board[0][0] === playerMark &&
        board[2][0] === playerMark &&
        board[1][0] !== computerMark
    ) {
        //center left
        board[1][0] = computerMark;
    } else if (
        board[0][1] === playerMark &&
        board[0][2] === playerMark &&
        board[0][0] !== computerMark
    ) {
        //top left
        board[0][0] = computerMark;
    } else if (
        board[0][1] === playerMark &&
        board[1][1] === playerMark &&
        board[2][1] !== computerMark
    ) {
        //bottom center
        board[2][1] = computerMark;
    } else if (
        board[0][1] === playerMark &&
        board[2][1] === playerMark &&
        board[1][1] !== computerMark
    ) {
        //center center
        board[1][1] = computerMark;
    } else if (
        board[1][1] === playerMark &&
        board[2][1] === playerMark &&
        board[0][1] !== computerMark
    ) {
        //top center
        board[0][1] = computerMark;
    } else if (
        board[1][2] === playerMark &&
        board[2][2] === playerMark &&
        board[0][2] !== computerMark
    ) {
        //right top
        board[0][2] = computerMark;
    } else if (
        board[0][2] === playerMark &&
        board[2][2] === playerMark &&
        board[1][2] !== computerMark
    ) {
        //right center
        board[1][2] = computerMark;
    } else if (
        board[0][2] === playerMark &&
        board[1][2] === playerMark &&
        board[2][2] !== computerMark
    ) {
        //right bottom
        board[2][2] = computerMark;
    } else if (
        board[0][0] === playerMark &&
        board[1][1] === playerMark &&
        board[2][2] !== computerMark
    ) {
        //right bottom
        board[2][2] = computerMark;
    } else if (
        board[0][0] === playerMark &&
        board[2][2] === playerMark &&
        board[1][1] !== computerMark
    ) {
        //middle
        board[2][2] = computerMark;
    } else if (
        board[2][2] === playerMark &&
        board[1][1] === playerMark &&
        board[0][0] !== computerMark
    ) {
        //left top
        board[0][0] = computerMark;
    } else if (
        board[2][0] === playerMark &&
        board[1][1] === playerMark &&
        board[0][2] !== computerMark
    ) {
        //top left
        board[0][2] = computerMark;
    } else if (
        board[2][0] === playerMark &&
        board[0][2] === playerMark &&
        board[1][1] !== computerMark
    ) {
        //middle
        board[1][1] = computerMark;
    } else if (
        board[0][2] === playerMark &&
        board[1][1] === playerMark &&
        board[2][0] !== computerMark
    ) {
        //right top
        board[2][0] = computerMark;
    } else {
        computerRandomTurn();
    }
};
*/

const computerBlockOrRandomTurnRefactored = () => {
    // TODO: Have computer look for winning move, then block, then random
    // check for winning play
    const winningSquare = checkFor2of3(computerMark);
    if (winningSquare != null) {
        board[winningSquare.row][winningSquare.col] = computerMark;
        return;
    }
    // check for blocking play
    const block = checkFor2of3(playerMark);
    if (block != null) {
        board[block.row][block.col] = computerMark;
        return;
    }
    // go in center square if it's open
    if (board[1][1] === "") {
        board[1][1] = computerMark;
        return;
    }

    // make random play
    computerRandomTurn();
};

/*
const checkRow = (rowIndex) => {
    // Checks row for 3 matching marks
    // Returns mark or null
    const row = board[rowIndex];
    if (row[0] === row[1] && row[0] === row[2]) {
        if (row[0] !== "") {
            return row[0];
        }
    }
    return null;
};
const checkCol = (colIndex) => {
    // Checks column for 3 matching marks
    // Returns mark or null
    const col = board.map((row) => row[colIndex]);
    if (col[0] === col[1] && col[0] === col[2]) {
        if (col[0] !== "") {
            return col[0];
        }
    }
    return null;
};
const checkDiagonals = () => {
    // Checks both diagonals for 3 matching marks
    // returns mark or null
    if (board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        if (board[0][0] !== "") {
            return board[0][0];
        }
    } else if (board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        if (board[0][2] !== "") {
            return board[0][2];
        }
    }
    return null;
};

const checkForWinner = () => {
    // Checks for 3 like symbols in any row, column or diagonal
    let winner;
    for (index = 0; index < 3; index++) {
        winner = checkRow(index);
        if (winner != null) {
            return winner;
        }
        winner = checkCol(index);
        if (winner != null) {
            return winner;
        }
    }
    winner = checkDiagonals();
    if (winner != null) {
        return winner;
    }
    return null;
};
*/

const checkFor2of3 = (mark) => {
    // Checks for 2 like symbols and a blank in any row, column or diagonal
    // returns {row,col} for empty third square
    let blockableIndex = false;
    let diagonalLeft = [];
    let diagonalRight = [];
    // check rows & columns
    for (index = 0; index < 3; index++) {
        const row = board[index];
        blockableIndex = checkFor2of3inLine(row, mark);
        if (blockableIndex !== false) {
            return { row: index, col: blockableIndex };
        }
        const col = board.map((row) => row[index]);
        blockableIndex = checkFor2of3inLine(col, mark);
        if (blockableIndex !== false) {
            return { row: blockableIndex, col: index };
        }
        // build diagonals
        diagonalLeft.push(board[index][index]);
        diagonalRight.push(board[2 - index][index]);
    }
    //  check diagonals
    console.log("diagonalLeft: ", diagonalLeft);
    blockableIndex = checkFor2of3inLine(diagonalLeft, mark);
    console.log("blockableIndex: ", blockableIndex);
    if (blockableIndex !== false) {
        return { row: blockableIndex, col: blockableIndex };
    }
    console.log("diagonalRight: ", diagonalRight);
    blockableIndex = checkFor2of3inLine(diagonalRight, mark);
    console.log("blockableIndex: ", blockableIndex);
    if (blockableIndex !== false) {
        return { row: 2 - blockableIndex, col: blockableIndex };
    }
    return null;
};

const checkFor2of3inLine = (threeSquares, mark) => {
    // parameter is a 3-square array
    // returns blank square index or false
    // is one of the squares blank?
    const blankIndex = threeSquares.indexOf("");

    if (blankIndex !== -1) {
        for (let index = 0; index < 3; index++) {
            // the other 2 must be desired mark
            if (index != blankIndex && threeSquares[index] !== mark) {
                return false;
            }
        }
        // this is the index to block
        return blankIndex;
    }
    return false;
};

const checkGameStatusRefactored = () => {
    winningTiles = [];
    // TODO: Check if board is filld and game is a draw
    //  returns winning mark, null, or "draw"
    // check all rows to see if they are all of one symbol
    for (const row of board) {
        let winner = row[0];
        for (const col of row) {
            if (col !== winner) {
                // Row not all the same
                winner = null;
                break;
            }
        }
        if (winner) {
            // If all 3 columns were the same, and not "", markToCheck has a value
            winningTiles = [[row,0],[row,1],[row,2]];
            return winner;
        }
    }
    // check all columns to see if they are all of one symbol
    for (let colIndex = 0; colIndex < 3; colIndex++) {
        let winner = board[0][colIndex];
        for (let rowIndex = 1; rowIndex < 3; rowIndex++) {
            // start index at 1, since we alreacy checked 0
            if (board[rowIndex][colIndex] !== winner) {
                winner = null;
                break;
            }
        }
        if (winner) {
            winningTiles = [[rowIndex,0],[rowIndex,1],[rowIndex,2]];
            return winner;
        }
    }
    // check both diagonals to see if they are all of one symbol
    // top left to bottom right
    winner = board[0][0];
    console.log("winner: ", winner);
    for (let diagonalIndex = 0; diagonalIndex < 3; diagonalIndex++) {
        // console.log(
        //     `board[${diagonalIndex}][${diagonalIndex}]: `,
        //     board[diagonalIndex][diagonalIndex]
        // );
        if (board[diagonalIndex][diagonalIndex] !== winner) {
            winner = null;
            break;
        }
    }
    // top right to bottom left
    // TODO: need to check right to left diagonal
    // If statements ok.  Loop would be fancy

    // Alternative Solution for backwards diagonal
    // rowIndex = 0;
    // colIndex = 2;
    // winner = board[0][2];
    // while(colIndex >= 1){
    //     rowIndex++;
    //     colIndex--;
    //     console.log(rowIndex, colIndex);
    //     if(board[rowIndex][colIndex] !== winner){
    //         winner = null;
    //         break;
    //     }
    // }
    if (!winner) {
        //    In-Class Solution for backwards diagonal
        winner = board[0][2];
        for (let rowIndex = 1; rowIndex < 3; rowIndex++) {
            let colIndex = 2 - rowIndex;
            if (board[rowIndex][colIndex] !== winner) {
                winner = null;
                break;
            }
        }
        if(winner){
            // 2,0 to 0,2 was teh winner
            winningTiles = [[2,0],[1,1],[0,2]];
        }
    } else {
        // 0,0 to 2,2 was the winner
        winningTiles = [[0,0],[1,1],[2,2]];
    }

    if (winner) {
        return winner;
    }
    // check for draw
    let draw = true;
    out: for (let colIndex = 0; colIndex < 3; colIndex++) {
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            // start index at 1, since we alreacy checked 0
            if (board[rowIndex][colIndex] === "") {
                draw = false;
                break out;
            }
        }
    }
    if (draw) return "draw";
    return false;
};

const alertWinnerAndClearBoard = (winner) => {
    setTimeout(() => {
        if (winner === "draw") {
            alert("The game is a draw.  Try again!");
        } else {
            alert(winner + " wins!");
        }
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
        winningTiles=[];
        updateHTML();
    }, 100);
};

const buttonClicked = (event) => {
    // Runs when user clicks on html button on the board
    // Updates board to show playerMark on clicked square
    // Checks for winner
    const row = event.target.getAttribute("data-row");
    const col = event.target.getAttribute("data-col");
    if (board[parseInt(row)][parseInt(col)] === "") {
        // Available square, place player mark
        board[parseInt(row)][parseInt(col)] = playerMark;
        updateHTML();
    } else {
        // move invalid, try again
        return;
    }

    // let winner = checkForWinner();
    let winner = checkGameStatusRefactored();
    if (winner === "draw") {
        updateHTML(true);
        alertWinnerAndClearBoard(winner);
    } else if (!winner) {
        setTimeout(() => {
            // computerRandomTurn();
            // computerBlockOrRandomTurn();
            computerBlockOrRandomTurnRefactored();
            winner = checkGameStatusRefactored();
            if (winner) {
                // Computer Won!
                alertWinnerAndClearBoard(winner);
            }
            // No Winner
            updateHTML();
        }, 1000);
    } else {
        // Player is Winner!
        updateHTML();
        alertWinnerAndClearBoard(winner);
    }
};

initHTML();
