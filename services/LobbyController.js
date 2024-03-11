const Room = require("./Room.js");
const Player = require("./Player.js");

const NUM_ROOMS = 2;
var rooms = [];

for (let i = 0; i < NUM_ROOMS; i++) {
    rooms.push(new Room(i+1));
}

function RegisterPlayerInRoom(player, register, previous) {
    if (previous)
        RemovePlayerFromTable(player, previous.team, previous.table, previous.pos);
    
    return addPlayerToTable(player, register.team, register.table, register.pos);
}

function addPlayerToTable(player, team, table, pos) {
    try {
        rooms[table-1].AddPlayerToTeam(player, team, pos);
        console.log('player added: ', player.username, '\nteams: ', rooms[table-1].teams[team-1].players);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function RemovePlayerFromTable(playerOut, team, table, pos) {
    try {
        rooms[table-1].RemovePlayer(playerOut, team, pos);
        console.log('player removed: ', playerOut.username, '\nteams: ', rooms[table-1].teams[team-1].players);
    } catch (error) {
        console.log(error);
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