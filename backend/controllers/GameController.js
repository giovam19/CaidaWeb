const LobbyController = require("./LobbyController");
const Game = require("../models/Game");
const Deck = require("../models/Deck");

const NUM_GAMES = LobbyController.NUM_TABLES;

/** @type {Game[]} */
var games = Array.from({ length: NUM_GAMES }, (_, i) => null);

function RegisterNewGame(id, players) {
    games[id-1] = new Game(id, new Deck(), players);
}

function PrepareGameForTable(id) {
    var game = games[id-1];
    game.players.find(player => player.username == user.username);
}

module.exports = {
    RegisterNewGame,
    PrepareGameForTable
}