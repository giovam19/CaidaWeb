const Room = require("./Room.js");
const Player = require("./Player.js");

const NUM_ROOMS = 2;
var rooms = [];

for (let i = 0; i < NUM_ROOMS; i++) {
    rooms.push(new Room(i+1));
}

function RegisterPlayerInRoom(player, register, previous) {
    var removed = null;
    if (previous)
        removed = RemovePlayerFromTable(player, previous.team, previous.table, previous.pos);
    
    var added = addPlayerToTable(player, register.team, register.table, register.pos);

    if (removed != null) {
        if (removed.code == 400 && added.code == 400) {
            return {code: 400, msg: added.msg + " | " + removed.msg}
        } else if (removed.code == 400 || added.msg == 400) {
            var msg = removed.code == 400 ? removed.msg : added.msg;
            return {code: 400, msg: msg};
        }
    }

    return added;
}

function addPlayerToTable(player, team, table, pos) {
    try {
        rooms[table-1].AddPlayerToTeam(player, team, pos);
        console.log('player added: ', player.username, '\nteams: ', rooms[table-1].teams[team-1].players);
        return {code: 200, msg: "Player added!"};
    } catch (error) {
        console.log(error);
        return {code: 400, msg: "Error removing player: " + error.message};
    }
}

function RemovePlayerFromTable(playerOut, team, table, pos) {
    try {
        rooms[table-1].RemovePlayer(playerOut, team, pos);
        console.log('player removed: ', playerOut.username, '\nteams: ', rooms[table-1].teams[team-1].players);
        return {code: 200, msg: "Player removed!"};
    } catch (error) {
        console.error(error);
        return {code: 400, msg: "Error removing player: " + error.message};
    }
}

function GetRooms() {
    return rooms;
}

module.exports = {
    RegisterPlayerInRoom,
    RemovePlayerFromTable,
    GetRooms
}