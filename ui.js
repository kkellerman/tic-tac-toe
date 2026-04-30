const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const cells = Array.from(document.querySelectorAll(".cell"));
const newRoundButton = document.getElementById("new-round");
const resetScoresButton = document.getElementById("reset-scores");
const scoreXElement = document.getElementById("score-x");
const scoreOElement = document.getElementById("score-o");
const scoreDrawsElement = document.getElementById("score-draws");

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
    cell.disabled = state.isGameOver || value !== null;
    cell.classList.remove("win");
  });

  if (state.winningPattern) {
    state.winningPattern.forEach((index) => {
      cells[index].classList.add("win");
    });
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