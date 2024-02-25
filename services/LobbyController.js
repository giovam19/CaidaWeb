const Deck = require("./deck.js");
const GameController = require("./game_controller.js");
const Player = require("./player.js");

var tables = {
    1: { id: 1, team1: [], team2: [] },
    2: { id: 2, team1: [], team2: [] }
};

function registerPlayerInRoom(player, table, team, pos) {
    removePlayerFromTable(player, table, team);
    var res = addPlayerToTable(player, team, table, pos);

    return res;
}

function addPlayerToTable(player, team, table, pos){
    var table = tables[table];
    
    switch(team) {
        case '1':
            return insertPlayerController(player, table.team1, pos);
        case '2':
            return insertPlayerController(player, table.team2, pos);
        default:
            console.log("No encuentra mesa");
    }

    return false;
}

function insertPlayerController(player, team, pos) {
    if (team.length == 2) {
        return false;
    }

    if (team.length == 1) {
        if (team[0].position == pos) {
            return false;
        }
    }

    var p = new Player(player, pos);
    team.push(p);
    console.log('add: ', tables);
    console.log('add player: ', p);
    return true;
}

function removePlayerFromTable(playerOut){
    for (var table in tables) {
        // Verificar si el jugador está en el equipo 1 de la mesa actual
        var indexTeam1 = tables[table].team1.findIndex(function(player) {
            return isEqual(player, playerOut);
        });
        if (indexTeam1 !== -1) {
            tables[table].team1.splice(indexTeam1, 1);
            break;
        }

        // Verificar si el jugador está en el equipo 2 de la mesa actual
        var indexTeam2 = tables[table].team2.findIndex(function(player) {
            return isEqual(player, playerOut);
        });
        if (indexTeam2 !== -1) {
            tables[table].team2.splice(indexTeam2, 1);
            break;
        }
    }

    console.log('remove: ', tables);
}

function isEqual(objA, objB) {
    return objA.id === objB.id;
}

function getTables() {
    return tables;
}

module.exports = {
    registerPlayerInRoom,
    removePlayerFromTable,
    getTables
}