class Player {
    constructor(user, pos, team) {
        this.username = user.username;
        this.id = user.id;
        this.score = 0;
        this.turn = false;
        this.cards = [];
        this.cardToPlay = null;
        this.team = team;
        this.position = pos;
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
        return this.username;
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

    getPosition() {
        return this.position;
    }

    isEmptyPlayer() {
        return this.position == 0;
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

    IsEqual(player) {
        return this.id == player.id && this.username == player.username;
    }
}

module.exports = Player;
