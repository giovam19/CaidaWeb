const crypto = require("crypto");
const LobbyController = require("./LobbyController");
const Game = require("../models/Game");
const Deck = require("../models/Deck");

const NUM_GAMES = LobbyController.NUM_TABLES;

/** @type {Game[]} */
var games = Array.from({ length: NUM_GAMES }, (_, i) => null);

function RegisterNewGame(id, players) {
    const gameId = crypto.randomUUID();
    games[id-1] = new Game(gameId, new Deck(), players, id);

    return gameId;
}

function CheckGameId(id, gameId) {
    if (!games[id-1]) {
        return null;
    }

    if (games[id-1].tableId == id && games[id-1].id == gameId) {
        return games[id-1];
    }

    return null;
}

function PrepareGameForTable(id) {
    var game = games[id-1];
    game.players.find(player => player.username == user.username);
}

module.exports = {
    RegisterNewGame,
    PrepareGameForTable,
    CheckGameId
}