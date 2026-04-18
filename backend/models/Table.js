const Team = require("./Team");
const Player = require("./Player");
const Helper = require("../helper");

class Table {
    constructor(id) {
        this.id = id;
        /** @type {Team[]} */
        this.teams = Array.from({ length: 2 }, (_, i) => new Team(i + 1));
        this.game = null;
    }

    AddPlayerToTeam(user, team, pos) {
        var newp = new Player(user, pos, team);
        if (team == 1) {
            if (this.teams[team-1].players[pos-1].isEmptyPlayer()) {
                this.teams[team-1].players[pos-1] = newp;
                return true;
            }
        } else {
            if (this.teams[team-1].players[pos-3].isEmptyPlayer()) {
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
            if (player.IsEqual(user)) {
                this.teams[team-1].players[pos-1] = Helper.setEmptyPlayer();
                return true;
            }
        } else {
            player = this.teams[team-1].players[pos-3];
            if (player.IsEqual(user)) {
                this.teams[team-1].players[pos-3] = Helper.setEmptyPlayer();
                return true;
            }
        }

        return false;
    }

    GetTeam(id) {
        return this.teams[id];
    }

    IsTableFull() {
        let ready = true;
        this.teams.forEach(team => {
            team.players.forEach(player => {
                if (player.isEmptyPlayer()) {
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

module.exports = Table;