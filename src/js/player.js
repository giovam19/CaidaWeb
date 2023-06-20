export default class Player {
    constructor(id, name) {
        this.name = name;
        this.id = id;
        this.score = 0;
        this.turn = false;
        this.cards = [];
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
}
