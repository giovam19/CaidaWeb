import Deck from "./deck.js"
import GameController from "./game_controller.js";
import Player from "./player.js";

const deck = new Deck();
const player1 = new Player(1, "Player 1");
const player2 = new Player(2, "Player 2");
const player3 = new Player(3, "Player 3");
const player4 = new Player(4, "Player 4");

const gameController = new GameController(deck, [player1, player2, player3, player4]);
gameController.invoke();