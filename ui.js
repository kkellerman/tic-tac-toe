const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const cells = Array.from(document.querySelectorAll(".cell"));
const newRoundButton = document.getElementById("new-round");
const resetScoresButton = document.getElementById("reset-scores");
const scoreXElement = document.getElementById("score-x");
const scoreOElement = document.getElementById("score-o");
const scoreDrawsElement = document.getElementById("score-draws");
const cellPositions = [
  "Top left", "Top middle", "Top right",
  "Middle left", "Center", "Middle right",
  "Bottom left", "Bottom middle", "Bottom right"
];

const game = window.createGame();

function initGame() {
  render();

  boardElement.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement) || !target.classList.contains("cell")) {
      return;
    }

    const index = Number(target.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }

    handleCellClick(index);
  });

  newRoundButton.addEventListener("click", () => {
    game.newRound();
    render();
    cells[0].focus();
  });

  resetScoresButton.addEventListener("click", () => {
    game.resetScores();
    render();
  });
}

function handleCellClick(index) {
  const move = game.playMove(index);
  if (!move.valid) {
    return;
  }

  render();
}

function render() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const value = state.board[index];
    cell.textContent = value ?? "";
    // Keep cells focusable so keyboard users can inspect the completed board.
    cell.setAttribute("aria-disabled", String(state.isGameOver || value !== null));
    const isWinningCell = state.winningPattern?.includes(index) ?? false;
    cell.setAttribute("aria-label", `${cellPositions[index]}, ${value ?? "empty"}${isWinningCell ? ", winning cell" : ""}`);
    cell.classList.toggle("win", isWinningCell);
    cell.classList.toggle("mark-x", value === "X");
    cell.classList.toggle("mark-o", value === "O");
  });

  statusElement.classList.toggle("is-complete", state.isGameOver);
  newRoundButton.textContent = state.isGameOver ? "Play Again" : "New Round";
  const displayedPlayer = state.isGameOver && !state.winningPattern ? null : state.currentPlayer;
  if (displayedPlayer) {
    statusElement.dataset.player = displayedPlayer;
  } else {
    delete statusElement.dataset.player;
  }

  if (state.isGameOver) {
    if (state.winningPattern) {
      const winner = state.board[state.winningPattern[0]];
      statusElement.textContent = `${winner} wins!`;
    } else {
      statusElement.textContent = "It's a draw!";
    }
  } else {
    statusElement.textContent = `${state.currentPlayer}'s turn`;
  }

  scoreXElement.textContent = String(state.scores.x);
  scoreOElement.textContent = String(state.scores.o);
  scoreDrawsElement.textContent = String(state.scores.draws);
}

initGame();
