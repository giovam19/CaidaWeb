import Card from "./Card";
import Deck from "./Deck";
import Player from "./Player";

class Game {
    private id: string;
    private tableId: number;
    private deck: Deck;
    private players: Player[];
    private cardsXPlayer: number;
    private numPlayers: number;
    private table: Card[];
    private startingPlayer: number;

    public constructor(id: string, deck: Deck, players: Player[], tableId: number) {
        this.id = id;
        this.tableId = tableId;
        this.deck = deck;
        this.players = players;
        this.cardsXPlayer = 3;
        this.numPlayers = players.length;
        this.table = [];
        this.startingPlayer = 0;
    }

    public IsAuthentic(tableId: number, gameId: string) {
        return this.tableId == tableId && this.id == gameId;
    }

    public GetPlayers() {
        return this.players;
    }

    public invoke() {
        this.initGame();
        this.startRound();
    }

    public initGame() {
        this.deck.shuffle();
        this.setTurns();
    }

    public startRound() {
        this.dealCards();
        this.setTable();
    }

    public dealCards() {
        for (let i = 0; i < this.cardsXPlayer; i++) {
            for (let j = 0; j < this.numPlayers; j++) {
                this.players[j]!.GetCards().push(this.deck.GetCards().shift()!);
            }
        }
    }

    public setTable() {
        for (let i = 0; i < 4; i++) {
            this.table.push(this.deck.GetCards().shift()!);
        }
    }

    public setTurns() {
        for (let i = 0; i < this.numPlayers; i++) {
            this.players[i]!.SetTurn(false);
        }
        this.players[this.startingPlayer]!.SetTurn(true);
    }
}

export = Game;