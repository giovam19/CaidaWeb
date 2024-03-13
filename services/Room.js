const Player = require("./Player.js");

class Room {
    constructor(id) {
        this.id = id;
        this.teams = new Array(2);

        for (let i = 0; i < 2; i++) {
            this.teams[i] = new Team(i+1);
        }
    }

    AddPlayerToTeam(player, team, pos) {
        if (team == 1) {
            if (this.teams[team-1].players[pos-1].position == 0) {
                this.teams[team-1].players[pos-1] = new Player(player, pos);
                return true;
            }
        } else {
            if (this.teams[team-1].players[pos-3].position == 0) {
                this.teams[team-1].players[pos-3] = new Player(player, pos);
                return true;
            }
        }

        return false;
    }

    RemovePlayer(player, team, pos) {
        if (team == 1) {
            this.teams[team-1].players[pos-1] = new Player({username: "", id: ""},0);
        } else {
            this.teams[team-1].players[pos-3] = new Player({username: "", id: ""},0);
        }
    }

    GetTeam(id) {
        return this.teams[id];
    }
}

class Team {
    constructor(id) {
        this.id = id;
        this.players = new Array(2);

        for (let i = 0; i < 2; i++) {
            this.players[i] = new Player({username: "", id: ""},0);
        }
    }
}

module.exports = Room;