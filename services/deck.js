const SUITS = ['♠', '♣', '♥', '♦'];
const NORMAL = ['A', '2', '3', '4', '5', '6', '7', '8', '9','10', 'J', 'Q', 'K'];
const CAIDA = ['A', '2', '3', '4', '5', '6', '7', 'J', 'Q', 'K'];

class Deck {
    constructor(cards = caidaDeck()) {
        this.cards = cards;
    }

    get numberOfCards() {
        return this.cards.length;
    }

    shuffle() {
        for (let i = this.numberOfCards - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1));
            const oldValue = this.cards[newIndex];
            this.cards[newIndex] = this.cards[i];
            this.cards[i] = oldValue;
        }
    }
}

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }
}

function freshDeck() {
    return SUITS.flatMap(suit => {
        return NORMAL.map(value => {
            return new Card(suit, value);
        })
    })
}

function caidaDeck() {
    return SUITS.flatMap(suit => {
        return CAIDA.map(value => {
            return new Card(suit, value);
        })
    })
}

module.exports = Deck;