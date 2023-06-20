export default class GameController {
    constructor(deck, players) {
        this.deck = deck;
        this.players = players;
        this.cardsXPlayer = 3;
        this.numPlayers = players.length;
        this.table = [];
        this.startingPlayer = 0;
    }

    invoke() {
        this.initGame();
        this.startRound();
    }

    initGame() {
        this.deck.shuffle();
        this.setTurns();
    }

    startRound() {
        this.dealCards();
        this.setTable();
    }

    dealCards() {
        for (let i = 0; i < this.cardsXPlayer; i++) {
            for (let j = 0; j < this.numPlayers; j++) {
                this.players[j].cards.push(this.deck.cards.shift());
            }
        }
    }

    setTable() {
        for (let i = 0; i < 4; i++) {
            this.table.push(this.deck.cards.shift());
        }
    }

    setTurns() {
        for (let i = 0; i < this.numPlayers; i++) {
            this.players[i].setTurn(false);
        }
        this.players[this.startingPlayer].setTurn(true);
    }
}
