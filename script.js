const board = document.querySelector('.board');
const overlay = document.querySelector('.overlay');
const restartBtn = document.querySelector('.restart-btn');
const ROWS = 6;
const COLS = 7;
let currentPlayer = 'red';
let gameBoard = [];

function createBoard() {
    for (let row = 0; row < ROWS; row++) {
        gameBoard[row] = [];
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            board.appendChild(cell);
            gameBoard[row][col] = null;
        }
    }
}

function checkWin(row, col) {
    const directions = [
        [0, 1],  // Horizontal
        [1, 0],  // Vertical
        [1, 1],  // Diagonal \
        [-1, 1]  // Diagonal /
    ];

    for (const [dx, dy] of directions) {
        let count = 1;
        for (let step = 1; step < 4; step++) {
            const r = row + step * dx;
            const c = col + step * dy;
            if (r < 0 || r >= ROWS || c < 0 || c >= COLS || gameBoard[r][c] !== currentPlayer) break;
            count++;
        }
        for (let step = -1; step > -4; step--) {
            const r = row + step * dx;
            const c = col + step * dy;
            if (r < 0 || r >= ROWS || c < 0 || c >= COLS || gameBoard[r][c] !== currentPlayer) break;
            count++;
        }
        if (count >= 4) {
            drawWinLine(row, col, dx, dy);
            return true;
        }
    }
    return false;
}

function drawWinLine(row, col, dx, dy) {
    const startX = col * 80 + 40;
    const startY = row * 80 + 40;
    const endX = (col + dx * 3) * 80 + 40;
    const endY = (row + dy * 3) * 80 + 40;

    const line = document.createElement('div');
    line.classList.add('win-line');
    line.style.left = startX + 'px';
    line.style.top = startY + 'px';
    line.style.width = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2) + 'px';
    line.style.transform = `rotate(${Math.atan2(endY - startY, endX - startX)}rad)`;
    board.appendChild(line);
}

function dropChecker(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (gameBoard[row][col] === null) {
            const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
            cell.classList.add(currentPlayer);
            gameBoard[row][col] = currentPlayer;
            return { row, col };
        }
    }
    return null;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
}

function handleClick(e) {
    if (!overlay.classList.contains('hidden')) return; // Game over
    const col = parseInt(e.target.dataset.col);
    const result = dropChecker(col);
    if (result) {
        if (checkWin(result.row, result.col)) {
            overlay.classList.remove('hidden');
            overlay.querySelector('.message').textContent = `${currentPlayer.toUpperCase()} Wins!`;
            return;
        }
        switchPlayer();
    }
}

function restartGame() {
    overlay.classList.add('hidden');
    overlay.querySelector('.message').textContent = '';
    currentPlayer = 'red';
    gameBoard = [];
    board.innerHTML = '';
    createBoard();
    const lines = document.querySelectorAll('.win-line');
    lines.forEach(line => line.remove());
}

createBoard();
board.addEventListener('click', handleClick);
restartBtn.addEventListener('click', restartGame);
function animateWinningCheckers(winningCheckers) {
    let count = 0;
    const blinkInterval = setInterval(() => {
        winningCheckers.forEach(cell => {
            cell.classList.toggle('blink');
        });
        if (count++ === 6) {
            clearInterval(blinkInterval);
        }
    }, 500);
}

function handleClick(e) {
    if (!overlay.classList.contains('hidden')) return; // Game over
    const col = parseInt(e.target.dataset.col);
    const result = dropChecker(col);
    if (result) {
        if (checkWin(result.row, result.col)) {
            overlay.classList.remove('hidden');
            overlay.querySelector('.message').textContent = `${currentPlayer.toUpperCase()} Wins!`;
            const winningCheckers = document.querySelectorAll('.cell.blink');
            animateWinningCheckers(winningCheckers);
            return;
        }
        switchPlayer();
    }
}

// Function to animate checker movement
function animateChecker(checker, targetCell) {
    const { top, left } = targetCell.getBoundingClientRect();
    checker.style.transform = `translate(${left - checker.offsetLeft}px, ${top - checker.offsetTop}px)`;
    checker.classList.add('dropped'); // Add dropped class to trigger animation
  }
  
  // Function to drop checker into the grid
  function dropCheckerIntoGrid(column, currentPlayer) {
    const targetCell = getFirstEmptyCell(column);
    if (targetCell) {
      const checker = createChecker(currentPlayer);
      grid.appendChild(checker);
      const columnIndex = parseInt(column.dataset.index);
      const rowIndex = parseInt(targetCell.dataset.row);
      gameBoard[rowIndex][columnIndex] = currentPlayer;
      animateChecker(checker, targetCell);
      const winningCombination = checkWin(rowIndex, columnIndex);
      if (winningCombination) {
        handleWin(winningCombination);
      } else if (checkDraw()) {
        handleDraw();
      } else {
        switchPlayer();
      }
    }
  }
  