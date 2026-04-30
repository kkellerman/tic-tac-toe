const SCORE_STORAGE_KEY = "ttt_scores_v1";
const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

class TicTacToeGame {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = "X";
    this.isGameOver = false;
    this.winningPattern = null;
    this.scores = this.loadScores();
  }

  playMove(index) {
    if (this.isGameOver || this.board[index] !== null) {
      return { valid: false };
    }

    this.board[index] = this.currentPlayer;

    const winnerData = this.checkWinner();
    if (winnerData) {
      this.winningPattern = winnerData.pattern;
      this.isGameOver = true;

      if (winnerData.player === "X") {
        this.scores.x += 1;
      } else {
        this.scores.o += 1;
      }

      this.saveScores();
      return { valid: true, result: winnerData.player };
    }

    const isDraw = this.board.every(function (cell) {
      return cell !== null;
    });

    if (isDraw) {
      this.isGameOver = true;
      this.scores.draws += 1;
      this.saveScores();
      return { valid: true, result: "draw" };
    }

    if (this.currentPlayer === "X") {
      this.currentPlayer = "O";
    } else {
      this.currentPlayer = "X";
    }

    return { valid: true, result: "in_progress" };
  }

  newRound() {
    this.board = Array(9).fill(null);
    this.currentPlayer = "X";
    this.isGameOver = false;
    this.winningPattern = null;
  }

  resetScores() {
    this.scores = { x: 0, o: 0, draws: 0 };
    localStorage.removeItem(SCORE_STORAGE_KEY);
  }

  getState() {
    let winningPatternCopy = null;
    if (this.winningPattern) {
      winningPatternCopy = this.winningPattern.slice();
    }

    return {
      board: this.board.slice(),
      currentPlayer: this.currentPlayer,
      isGameOver: this.isGameOver,
      winningPattern: winningPatternCopy,
      scores: {
        x: this.scores.x,
        o: this.scores.o,
        draws: this.scores.draws
      }
    };
  }

  checkWinner() {
    for (let i = 0; i < WIN_PATTERNS.length; i += 1) {
      const pattern = WIN_PATTERNS[i];
      const a = pattern[0];
      const b = pattern[1];
      const c = pattern[2];

      const value = this.board[a];
      if (value && value === this.board[b] && value === this.board[c]) {
        return { player: value, pattern: pattern };
      }
    }

    return null;
  }

  loadScores() {
    try {
      const raw = localStorage.getItem(SCORE_STORAGE_KEY);
      if (!raw) {
        return { x: 0, o: 0, draws: 0 };
      }

      const parsed = JSON.parse(raw);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        Number.isInteger(parsed.x) &&
        Number.isInteger(parsed.o) &&
        Number.isInteger(parsed.draws)
      ) {
        return { x: parsed.x, o: parsed.o, draws: parsed.draws };
      }
    } catch (error) {
      // Fallback to defaults for malformed or unavailable storage.
    }

    return { x: 0, o: 0, draws: 0 };
  }

  saveScores() {
    localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(this.scores));
  }
}

window.createGame = function () {
  return new TicTacToeGame();
};