import crypto from "crypto"
import Game from "../models/Game"
import Deck from "../models/Deck"
import Player from "../models/Player";
import UserDTO from "../../shared/DTO/UserDTO";

class GameController {
    readonly NUM_GAMES = 2;
    private games: (Game|null)[];

    public constructor() {
        this.games = Array.from({ length: this.NUM_GAMES }, (_, i) => null);
    }

    public RegisterNewGame(id: number, players: Player[]): string {
        const gameId = crypto.randomUUID();
        this.games[id-1] = new Game(gameId, new Deck(), players, id);

        return gameId;
    }

    public CheckGameId(id: number, gameId: string): Game | null {
        const game = this.games[id-1];

        if (game != null && game.IsAuthentic(id, gameId)) {
            return game;
        }

        return null;
    }

    public PrepareGameForTable(id: number, user: UserDTO) {
        var game = this.games[id-1]!;
        game.GetPlayers().find(player => player.GetUsername() == user.username);
    }
}

export = GameController