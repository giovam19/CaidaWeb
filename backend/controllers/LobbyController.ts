import { BasicResponse } from "../../shared/DTO/ResponseDTO";
import SeatDTO from "../../shared/DTO/SeatDTO";
import UserDTO from "../../shared/DTO/UserDTO";
import Table from "../models/Table";

class LobbyController {
    readonly NUM_TABLES = 2;
    readonly MAX_NUM_TEAMS_PER_TABLE = 2;
    readonly MAX_NUM_POS_PER_TEAM = 4;
    private tables: Table[];

    public constructor() {
        this.tables = Array.from({ length: this.NUM_TABLES }, (_, i) => new Table(i+1));
    }

    public RegisterPlayerInTable(user: UserDTO, actualSeat: SeatDTO|null, seat: SeatDTO): BasicResponse {
        if (!this.isValidSeat(seat)) {
            return {code: 400, message: "Datos de mesa invalidos."};
        }
        
        if (actualSeat != null) {
            var removed = this.RemovePlayerFromTable(user, actualSeat);
            if (removed.code == 400) {
                return {code: 400, message: removed.message}
            }
        }

        var added = this.addPlayerToTable(user, seat);

        return added;
    }

    public addPlayerToTable(user: UserDTO, seat: SeatDTO): BasicResponse {
        try {
            var added = this.tables[seat.table-1]!.AddPlayerToTeam(user, seat);
            if (!added) {
                return {code: 400, message: "Error adding player " + user.username + ": Position already taken!"};
            }
            return {code: 200, message: "Player added: " + user.username + " table: " + seat.table + " team: " + seat.team + " pos: " + seat.position};
        } catch (error) {
            if (error instanceof Error) {
                return {code: 400, message: "Error adding player " + user.username + ": " + error.message};
            } else {
                return {code: 400, message: "Error adding player " + user.username + ": Unknown error"};
            }
        }
    }

    public RemovePlayerFromTable(user: UserDTO, seat: SeatDTO): BasicResponse {
        try {
        var removed = this.tables[seat.table-1]!.RemovePlayer(user, seat);
            if (!removed) {
                return {code: 400, message: "Error removing player " + user.username + ": No se puede remover al player - no coinciden."};
            }
            return {code: 200, message: 'Player removed: ' + user.username + ' table: ' + seat.table + ' team: ' + seat.team + " pos: " + seat.position};
        } catch (error) {
            if (error instanceof Error) {
                return {code: 400, message: "Error removing player " + user.username + ": " + error.message};
            } else {
                return {code: 400, message: "Error removing player " + user.username + ": Unknown error"};
            }
        }
    }

    public GetTables() {
        return this.tables;
    }

    public GetTableById(id: number) {
        return this.tables[id-1];
    }

    public GetPlayersByTable(table: number) {
        return this.tables[table-1]!.GetPlayers();
    }

    public isValidSeat(seat: SeatDTO): boolean {
        const table = seat.table;
        const team = seat.team;
        const pos = seat.position;

        if (table == null || table == undefined ||
            team == null || team == undefined ||
            pos == null || pos == undefined) {
            return false;
        }
        if (table <= 0 || table > this.NUM_TABLES) {
            return false;
        }
        if (team <= 0 || team > this.MAX_NUM_TEAMS_PER_TABLE) {
            return false;
        }
        if (pos <= 0 || pos > this.MAX_NUM_POS_PER_TEAM) {
            return false;
        }
        if ((team == 1 && pos > 2) || (team == 2 && pos < 3)) {
            return false;
        }

        return true;
    }
}

export = LobbyController