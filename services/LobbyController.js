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
            return {code: 400, message: added.message + " | " + removed.message}
        } else if (removed.code == 400 || added.message == 400) {
            var message = removed.code == 400 ? removed.message : added.message;
            return {code: 400, message: message};
        }
    }

    return added;
}

function addPlayerToTable(player, team, table, pos) {
    try {
        var added = rooms[table-1].AddPlayerToTeam(player, team, pos);
        if (!added) {
            throw new Error('Position already taken!');
        }
        console.log('player added: ', player.username, '\nteams: ', rooms[table-1].teams[team-1].players);
        return {code: 200, message: "Player added!"};
    } catch (error) {
        console.log(error);
        return {code: 400, message: "Error adding player: " + error.message};
    }
}

function RemovePlayerFromTable(playerOut, team, table, pos) {
    try {
        rooms[table-1].RemovePlayer(playerOut, team, pos);
        console.log('player removed: ', playerOut.username, '\nteams: ', rooms[table-1].teams[team-1].players);
        return {code: 200, message: "Player removed!"};
    } catch (error) {
        console.error(error);
        return {code: 400, message: "Error removing player: " + error.message};
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