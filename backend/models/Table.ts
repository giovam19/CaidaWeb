import Team from "./Team";
import Player from "./Player";
import UserDTO from "../../shared/DTO/UserDTO";
import SeatDTO from "../../shared/DTO/SeatDTO";

class Table {
    private id: number;
    private teams: Team[];
    private gameId: string | null;

    public constructor(id: number) {
        this.id = id;
        this.teams = [new Team(1), new Team(2)];
        this.gameId = null;
    }

    public AddPlayerToTeam(user: UserDTO, seat: SeatDTO): boolean {
        var newp = new Player(user, seat);
        
        if (seat.team == 1) {
            if (this.teams[seat.team-1]!.GetPlayer(seat.position-1) == null) {
                this.teams[seat.team-1]!.SetPlayer(newp, seat.position-1);
                return true;
            }
        } else {
            if (this.teams[seat.team-1]!.GetPlayer(seat.position-3) == null) {
                this.teams[seat.team-1]!.SetPlayer(newp, seat.position-3);
                return true;
            }
        }

        return false;
    }

    public RemovePlayer(user: UserDTO, seat: SeatDTO): boolean {
        var player: Player|null = null;
        
        if (seat.team == 1) {
            player = this.teams[seat.team-1]!.GetPlayer(seat.position-1);
            if (player != null && player.IsEqual(user)) {
                this.teams[seat.team-1]!.SetPlayer(null, seat.position-1);
                return true;
            }
        } else {
            player = this.teams[seat.team-1]!.GetPlayer(seat.position-3);
            if (player != null && player.IsEqual(user)) {
                this.teams[seat.team-1]!.SetPlayer(null, seat.position-3);
                return true;
            }
        }

        return false;
    }

    public GetId(): number {
        return this.id;
    }

    public GetGameId(): string | null {
        return this.gameId;
    }

    public SetGameId(id: string) {
        this.gameId = id;
    }

    public GetTeam(id: number): Team {
        return this.teams[id]!;
    }

    public IsTableFull(): boolean {
        let players = this.GetPlayers();

        return players.every(player => player !== null);
    }

    public GetPlayers(): (Player|null)[] {
        let players = this.teams[0]!.GetPlayers().concat(this.teams[1]!.GetPlayers());
        return players;
    }
}

export = Table;