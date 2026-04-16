const Table = require("./Table.js");

const NUM_TABLES = 2;
const MAX_NUM_TEAMS_PER_TABLE = 2;
const MAX_NUM_POS_PER_TEAM = 4;

/** @type {Table[]} */
var tables = Array.from({ length: NUM_TABLES }, (_, i) => new Table(i+1));

function RegisterPlayerInTable(user, actualSeat, seat) {
    if (actualSeat) {
        var removed = RemovePlayerFromTable(user, actualSeat.team, actualSeat.table, actualSeat.pos);
        if (removed.code == 400) {
            return {code: 400, message: removed.message}
        }
    }

    var added = addPlayerToTable(user, seat.team, seat.table, seat.pos);

    return added;
}

function addPlayerToTable(user, team, table, pos) {
    try {
        var added = tables[table-1].AddPlayerToTeam(user, team, pos);
        if (!added) {
            return {code: 400, message: "Error adding player " + user.username + ": Position already taken!"};
        }
        return {code: 200, message: "Player added: " + user.username + " table: " + table + " team: " + team};
    } catch (error) {
        return {code: 400, message: "Error adding player " + user.username + ": " + error.message};
    }
}

function RemovePlayerFromTable(user, team, table, pos) {
    try {
       var removed = tables[table-1].RemovePlayer(user, team, pos);
        if (!removed) {
            return {code: 400, message: "Error removing player " + user.username + ": No se puede remover al player - no coinciden."};
        }
        return {code: 200, message: 'Player removed: ' + user.username + ' table: ' + table + ' team: ' + team};
    } catch (error) {
        return {code: 400, message: "Error removing player " + user.username + ": " + error.message};
    }
}

function GetTables() {
    return tables;
}

function GetTableById(id) {
    return tables[id-1];
}

function GetPlayersByTable(table) {
    return tables[table-1].GetPlayers();
}

function isValidSeat(seat) {
    const table = seat.table;
    const team = seat.team;
    const pos = seat.pos;

    if (table < 0 || table > NUM_TABLES) {
        return false;
    }
    if (team < 0 || team > MAX_NUM_TEAMS_PER_TABLE) {
        return false;
    }
    if (pos < 0 || pos > MAX_NUM_POS_PER_TEAM) {
        return false;
    }
    if ((team == 1 && pos > 2) || (team == 2 && pos < 3)) {
        return false;
    }

    return true;
}

module.exports = {
    RegisterPlayerInTable,
    RemovePlayerFromTable,
    GetTables,
    GetTableById,
    GetPlayersByTable,
    isValidSeat
}