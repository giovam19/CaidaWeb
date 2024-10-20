const Player = require("./Player.js");

class Table {
    constructor(id) {
        this.id = id;
        this.teams = new Array(2);

        for (let i = 0; i < 2; i++) {
            this.teams[i] = new Team(i+1);
        }
    }

    AddPlayerToTeam(user, socket, team, pos) {
        var newp = new Player(user, pos, socket);
        if (team == 1) {
            if (this.teams[team-1].players[pos-1].position == 0) {
                this.teams[team-1].players[pos-1] = newp;
                return true;
            }
        } else {
            if (this.teams[team-1].players[pos-3].position == 0) {
                this.teams[team-1].players[pos-3] = newp;
                return true;
            }
        }

        return false;
    }

    RemovePlayer(team, pos) {
        if (team == 1) {
            this.teams[team-1].players[pos-1] = new Player({username: "", id: ""}, 0, null);
        } else {
            this.teams[team-1].players[pos-3] = new Player({username: "", id: ""}, 0, null);
        }
    }

    GetTeam(id) {
        return this.teams[id];
    }

    IsRoomReady() {
        let ready = true;
        this.teams.forEach(team => {
            team.players.forEach(player => {
                if (player.position == 0) {
                    ready = false;
                    return ready;
                }
            });
        });

        return ready;
    }

    GetPlayers() {
        let players = this.teams[0].players.concat(this.teams[1].players)
        return players;
    }
}

class Team {
    constructor(id) {
        this.id = id;
        this.players = new Array(2);

        for (let i = 0; i < 2; i++) {
            this.players[i] = new Player({username: "", id: ""}, 0, null);
        }
    }
}

module.exports = Table;