const Player = require("./Player");

class Team {
    constructor(id) {
        this.id = id;
        
        /** @type {Player[]} */
        this.players = Array.from({ length: 2 }, () => Helper.setEmptyPlayer());
    }
}

module.exports = Team;