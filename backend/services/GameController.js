const Game = require("./Game.js");
const Deck = require("./DeckController.js");

const NUM_TABLES = 2;
var games = [];

/* for (let i = 0; i < NUM_TABLES; i++) {
    games.push(new Game(i+1, new Deck(), {}));
} */

function RegisterNewGame(id, players) {
    var game_id = games.push(new Game(id, new Deck(), players));
    return game_id-1;
}

function PrepareGameForTable(id) {
    var game = games[id-1];
    game,players.find(player => player.username == user.username)
}

module.exports = {
    RegisterNewGame,
    PrepareGameForTable
}