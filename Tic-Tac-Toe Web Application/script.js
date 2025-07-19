const board = document.getElementById("board");
const statusDiv = document.getElementById("status");
const modeRadios = document.getElementsByName("mode");

let cells = [];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "pvp";

// Winning combinations
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function createBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleClick(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleClick(index) {
  if (!gameActive || cells[index].textContent !== "") return;

  cells[index].textContent = currentPlayer;
  if (checkWin()) {
    let emoji = currentPlayer === "X" ? "🎉✨" : "🏆🔥";
    statusDiv.textContent = `${currentPlayer} wins! ${emoji}`;
    gameActive = false;
    highlightWinningCells();
    return;
  }

  if (checkDraw()) {
    statusDiv.textContent = "It's a draw! 🤝";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDiv.textContent = `${currentPlayer}'s turn`;

  if (gameMode === "cpu" && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  let emptyCells = cells
    .map((cell, idx) => (cell.textContent === "" ? idx : null))
    .filter(idx => idx !== null);

  if (emptyCells.length === 0) return;

  let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  handleClick(randomIndex);
}

function checkWin() {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[b].textContent === cells[c].textContent
    ) {
      // Store the winning pattern
      winningPattern = [a, b, c];
      return true;
    }
    return false;
  });
}

let winningPattern = [];

function highlightWinningCells() {
  if (winningPattern.length === 3) {
    winningPattern.forEach(i => {
      cells[i].style.backgroundColor = "#00bfa6";
      cells[i].style.color = "#fff";
    });
  }
}

function checkDraw() {
  return cells.every(cell => cell.textContent !== "");
}

function resetGame() {
  currentPlayer = "X";
  gameActive = true;
  statusDiv.textContent = `${currentPlayer}'s turn`;
  winningPattern = [];
  createBoard();
}

modeRadios.forEach(radio => {
  radio.addEventListener("change", e => {
    gameMode = e.target.value;
    resetGame();
  });
});

createBoard();
statusDiv.textContent = `${currentPlayer}'s turn`;
