import Card = require("./Card");

const SUITS = ['♠', '♣', '♥', '♦'];
const NORMAL = ['A', '2', '3', '4', '5', '6', '7', '8', '9','10', 'J', 'Q', 'K'];
const CAIDA = ['A', '2', '3', '4', '5', '6', '7', 'J', 'Q', 'K'];

class Deck {
    private cards: Card[];

    public constructor() {
        this.cards = this.caidaDeck();
    }

    public GetCards(): Card[] {
        return this.cards;
    }

    public numberOfCards(): number {
        return this.cards.length;
    }

    public shuffle(): void {
        let numCards = this.numberOfCards();
        for (let i = numCards-1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1));
            const oldValue = this.cards[newIndex]!;
            this.cards[newIndex] = this.cards[i]!;
            this.cards[i] = oldValue;
        }
    }

    private freshDeck(): Card[] {
        return SUITS.flatMap(suit => {
            return NORMAL.map(value => {
                return new Card(suit, value);
            })
        })
    }
    
    private caidaDeck(): Card[] {
        return SUITS.flatMap(suit => {
            return CAIDA.map(value => {
                return new Card(suit, value);
            })
        })
    }
}

export = Deck;