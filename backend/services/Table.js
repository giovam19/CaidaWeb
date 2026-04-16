const Player = require("./Player.js");
const Helper = require("../helper.js");

class Table {
    constructor(id) {
        this.id = id;

        /** @type {Team[]} */
        this.teams = Array.from({ length: 2 }, (_, i) => new Team(i + 1));
    }

    AddPlayerToTeam(user, team, pos) {
        var newp = new Player(user, pos);
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

    RemovePlayer(user, team, pos) {
        var player = null;
        if (team == 1) {
            player = this.teams[team-1].players[pos-1];
            if (player.id == user.id && player.username == user.username) {
                this.teams[team-1].players[pos-1] = Helper.setEmptyPlayer();
                return true;
            }
        } else {
            player = this.teams[team-1].players[pos-3];
            if (player.id == user.id && player.username == user.username) {
                this.teams[team-1].players[pos-3] = Helper.setEmptyPlayer();
                return true;
            }
        }

        return false;
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
        
        /** @type {Player[]} */
        this.players = Array.from({ length: 2 }, () => Helper.setEmptyPlayer());
    }
}

module.exports = Table;