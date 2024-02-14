export default class Player {
    constructor(id, name) {
        this.name = name;
        this.id = id;
        this.score = 0;
        this.turn = false;
        this.cards = [];
        this.cardToPlay = null;
    }

    addScore() {
        this.score++;
    }

    setTurn(turn) {
        this.turn = turn;
    }

    getTurn() {
        return this.turn;
    }

    getScore() {
        return this.score;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    setCards(cards) {
        this.cards = cards;
    }

    getCards() {
        return this.cards;
    }

    choseACard(cardIndex) {
        this.cardToPlay = cardIndex
    }

    makeMove() {
        if (!this.turn) {
            console.log("Wait your turn!");
            return null;
        }

        if (this.cardToPlay == null){
            console.log("Select a Card to play!");
            return null;
        }

        var played = this.cards[this.cardToPlay];
        this.cardToPlay = null;

        return played;
    }
}
