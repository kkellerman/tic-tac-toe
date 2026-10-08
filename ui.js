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
let confettiLayer = null;
let confettiTimeout = null;

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
    clearConfetti();
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
  if (move.result === "X" || move.result === "O") {
    celebrateWin();
  }
}

function clearConfetti() {
  confettiLayer?.remove();
  confettiLayer = null;
  window.clearTimeout(confettiTimeout);
  confettiTimeout = null;
}

function celebrateWin() {
  clearConfetti();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const boardBounds = boardElement.getBoundingClientRect();
  const originX = boardBounds.left + boardBounds.width / 2;
  const originY = boardBounds.top + boardBounds.height / 2;
  const colors = ["#ec3f54", "#177dc7", "#f5b942", "#56b786", "#9564d8"];
  confettiLayer = document.createElement("div");
  confettiLayer.className = "confetti-layer";
  confettiLayer.setAttribute("aria-hidden", "true");
  document.body.appendChild(confettiLayer);

  for (let i = 0; i < 56; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    confettiLayer.appendChild(piece);

    const spread = (Math.random() - 0.5) * Math.min(window.innerWidth, 800);
    const rise = -(80 + Math.random() * 160);
    const fall = window.innerHeight - originY + 24;
    const rotation = (Math.random() - 0.5) * 1080;
    piece.animate([
      { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
      { transform: `translate(${spread * 0.6}px, ${rise}px) rotate(${rotation * 0.4}deg)`, opacity: 1, offset: 0.35 },
      { transform: `translate(${spread}px, ${fall}px) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: 1400 + Math.random() * 500,
      delay: Math.random() * 120,
      easing: "ease-out",
      fill: "both"
    });
  }

  // Remove the decorative layer after the last piece finishes.
  confettiTimeout = window.setTimeout(clearConfetti, 2200);
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
