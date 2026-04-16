const Player = require("./services/Player.js");

function emptyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows;
}

function setEmptyPlayer() {
    return new Player({ username: "", id: "" }, 0);
}

module.exports = {
    emptyOrRows,
    setEmptyPlayer
};
