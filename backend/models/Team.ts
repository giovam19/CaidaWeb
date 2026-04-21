import Player from "./Player"

class Team {
    private id: number;
    private players: (Player | null)[];

    public constructor(id: number) {
        this.id = id;
        this.players = [null, null];
    }

    public GetId(): number {
        return this.id;
    }

    public GetPlayers(): (Player | null)[] {
        return this.players;
    }

    public GetPlayer(index: number): (Player | null) {
        return this.players[index]!;
    }

    public SetPlayer(player: (Player | null), index: number) {
        this.players[index] = player;
    }
}

export = Team;