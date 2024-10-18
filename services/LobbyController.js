const Table = require("./Table.js");

const NUM_TABLES = 2;
var tables = [];

for (let i = 0; i < NUM_TABLES; i++) {
    tables.push(new Table(i+1));
}

function RegisterPlayerInTable(socket, register, previous) {
    var removed = null;
    if (previous)
        removed = RemovePlayerFromTable(previous.team, previous.table, previous.pos);

    if (removed != null && removed.code == 400) {
        return {code: 400, message: removed.message}
    }
    
    var added = addPlayerToTable(socket, register.team, register.table, register.pos);

    return added;
}

function addPlayerToTable(socket, team, table, pos) {
    try {
        var added = tables[table-1].AddPlayerToTeam(socket, team, pos);
        if (!added) {
            throw new Error('Position already taken!');
        }
        console.log('player added: ', socket.user.username, 'table: ', table, 'team: ', team);
        return {code: 200, message: "Player added!"};
    } catch (error) {
        console.error(error);
        return {code: 400, message: "Error adding player: " + error.message};
    }
}

function RemovePlayerFromTable(team, table, pos) {
    try {
        tables[table-1].RemovePlayer(team, pos);
        console.log('player removed table: ', table, 'team: ', team);
        return {code: 200, message: "Player removed!"};
    } catch (error) {
        console.error(error);
        return {code: 400, message: "Error removing player: " + error.message};
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

module.exports = {
    RegisterPlayerInTable,
    RemovePlayerFromTable,
    GetTables,
    GetTableById,
    GetPlayersByTable
}