const db = require('../db/db');
const helper = require('../helper');
const bcrypt = require('bcryptjs');

async function loggin(email, pass) {
    const rows = await db.query(
        `SELECT username, password FROM users where email = ?`,
        [email]
    );
    var data = helper.emptyOrRows(rows);
    data = helper.validateLogin(data, pass);

    return data;
}

async function register(email, name, username, pass) {
    const encryptedPass = await bcrypt.hash(pass, 10);

    try {
        await db.query(`INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)`, [name, username, email, encryptedPass]);
        return 0;
    } catch (err) {
        console.error(`Error while inserting user `, err.errno, err.sqlMessage);
        return err.errno;
    }
}

module.exports = {
    loggin,
    register
}