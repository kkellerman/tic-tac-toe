const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const source = fs.readFileSync(path.join(__dirname, "../game-logic.js"), "utf8");

function createGame(storageUnavailable = false) {
  const stored = new Map();
  const localStorage = Object.fromEntries(
    ["getItem", "setItem", "removeItem"].map((method) => [method, (key, value) => {
      if (storageUnavailable) throw new Error("Storage blocked");
      if (method === "getItem") return stored.get(key) ?? null;
      if (method === "setItem") stored.set(key, value);
      if (method === "removeItem") stored.delete(key);
    }])
  );
  const context = vm.createContext({ window: {}, localStorage });
  vm.runInContext(source, context);
  return { game: context.window.createGame(), stored, createAnother: context.window.createGame };
}

for (const storageUnavailable of [false, true]) {
  const storageDescription = storageUnavailable ? "blocked storage" : "available storage";

  test(`a winning round, replay, and score reset work with ${storageDescription}`, () => {
    const { game, stored, createAnother } = createGame(storageUnavailable);
    for (const index of [0, 3, 1, 4]) assert.equal(game.playMove(index).valid, true);
    assert.equal(game.playMove(2).result, "X");
    assert.equal(game.getState().scores.x, 1);
    assert.equal(game.getState().winningPattern.join(","), "0,1,2");
    assert.equal(game.playMove(8).valid, false);
    if (!storageUnavailable) assert.equal(createAnother().getState().scores.x, 1);

    game.newRound();
    assert.equal(game.getState().board.every((cell) => cell === null), true);
    assert.equal(game.getState().currentPlayer, "X");
    assert.equal(game.getState().scores.x, 1);
    assert.equal(game.playMove(0).valid, true);
    assert.equal(game.playMove(0).valid, false);
    game.resetScores();
    assert.equal(game.getState().scores.x, 0);
    assert.equal(game.getState().board[0], "X");
    assert.equal(stored.size, 0);
  });

  test(`draws and O wins work with ${storageDescription}`, () => {
    const { game } = createGame(storageUnavailable);
    let move;
    for (const index of [0, 1, 2, 4, 3, 5, 7, 6, 8]) move = game.playMove(index);
    assert.equal(move.result, "draw");
    assert.equal(game.getState().scores.draws, 1);
    game.newRound();
    for (const index of [0, 3, 1, 4, 8, 5]) move = game.playMove(index);
    assert.equal(move.result, "O");
    assert.equal(game.getState().scores.o, 1);
    assert.equal(game.getState().scores.draws, 1);
    game.resetScores();
    assert.equal(Object.values(game.getState().scores).every((score) => score === 0), true);
  });
}
