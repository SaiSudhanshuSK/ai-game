const board = Array(9).fill(null);
const player = "X";
const ai = "O";
const winSound = document.getElementById("win-sound");
const loseSound = document.getElementById("lose-sound");
const drawSound = document.getElementById("draw-sound");
const statusDisplay = document.getElementById("status");
const gameBoard = document.getElementById("game-board");

// Create game cells
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.addEventListener("click", () => handlePlayerMove(i));
  gameBoard.appendChild(cell);
}

// Handle player move
function handlePlayerMove(index) {
  if (board[index] || isGameOver()) return;

  board[index] = player;
  updateBoard();
  if (checkWinner(player)) {
    statusDisplay.textContent = "You Win!";
    winSound.play();
    return;
  }
  if (board.every(cell => cell !== null)) {
    statusDisplay.textContent = "It's a Draw!";
    drawSound.play();
    return;
  }

  statusDisplay.textContent = "AI's Turn...";
  setTimeout(handleAIMove, 500);
}

// AI move
function handleAIMove() {
  const bestMove = findBestMove();
  board[bestMove] = ai;
  updateBoard();
  if (checkWinner(ai)) {
    statusDisplay.textContent = "You Lose!";
    loseSound.play();
    return;
  }
  if (board.every(cell => cell !== null)) {
    statusDisplay.textContent = "It's a Draw!";
    drawSound.play();
    return;
  }

  statusDisplay.textContent = "Your Turn!";
}

// Minimax Algorithm
function findBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = ai;
      const score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner(ai)) return 10 - depth;
  if (checkWinner(player)) return depth - 10;
  if (board.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = ai;
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = player;
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Check winner
function checkWinner(symbol) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === symbol)
  );
}

// Update board
function updateBoard() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
    cell.textContent = board[index];
    cell.classList.toggle("taken", !!board[index]);
  });
}

// Check if game is over
function isGameOver() {
  return checkWinner(player) || checkWinner(ai) || board.every(cell => cell !== null);
}

// Reset game
document.getElementById("reset").addEventListener("click", () => {
  board.fill(null);
  updateBoard();
  statusDisplay.textContent = "Your Turn!";
});