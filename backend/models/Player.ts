import Card from "./Card"
import UserDTO from "../../shared/DTO/UserDTO"
import SeatDTO from "../../shared/DTO/SeatDTO"

class Player {
    private id: string;
    private username: string;
    private score : number;
    private turn: boolean;
    private cards: Card[];
    private cardToPlay: number;
    private team: number;
    private position: number;

    public constructor(user: UserDTO, seat: SeatDTO) {
        this.id = user.id;
        this.username = user.username;
        this.score = 0;
        this.turn = false;
        this.cards = [];
        this.cardToPlay = 0;
        this.team = seat.team;
        this.position = seat.position;
    }

    public AddScore(score: number) {
        this.score += score;
    }

    public GetScore(): number {
        return this.score;
    }

    public SetTurn(turn: boolean) {
        this.turn = turn;
    }

    public GetTurn(): boolean {
        return this.turn;
    }

    public GetUsername(): string {
        return this.username;
    }

    public GetId(): string {
        return this.id;
    }

    public SetCards(cards: Card[]) {
        this.cards = cards;
    }

    public GetCards(): Card[] {
        return this.cards;
    }

    public GetPosition(): number {
        return this.position;
    }

    public IsEmptyPlayer(): boolean {
        return this.position == 0;
    }

    public ChoseACard(cardIndex: number) {
        this.cardToPlay = cardIndex
    }

    public MakeMove(): Card | null {
        if (!this.turn) {
            console.log("Wait your turn!");
            return null;
        }

        if (this.cardToPlay == 0){
            console.log("Select a Card to play!");
            return null;
        }

        var played = this.cards[this.cardToPlay]!;
        this.cardToPlay = 0;

        return played;
    }

    public IsEqual(player: UserDTO): boolean {
        return this.id == player.id && this.username == player.username;
    }
}

export = Player;
