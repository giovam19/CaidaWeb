const Player = require("./Player");
const Helper = require("../helper");

class Team {
    constructor(id) {
        this.id = id;
        
        /** @type {Player[]} */
        this.players = Array.from({ length: 2 }, () => Helper.setEmptyPlayer());
    }
}

module.exports = Team;