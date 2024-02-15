const db = require('../db/db');
const helper = require('../helper');
const bcrypt = require('bcryptjs');

async function loggin(email, pass) {
    const rows = await db.query(
        `SELECT username, email, password FROM users WHERE email = ?`,
        [email]
    );
    var data = helper.emptyOrRows(rows);
    data = helper.validateLogin(data, pass);

    return data;
}

async function existUser(email) {
    const rows = await db.query(`SELECT email FROM users WHERE email = ?`, [email]);
    var data = helper.emptyOrRows(rows);

    if (data.length > 0) {
        return true;
    }
        
    return false;
}

async function register(email, name, username, pass) {
    try {
        var emailExists = await existUser(email);
        if (emailExists) {
            return {isError: true, message: "Usuario registrado"};
        }

        const encryptedPass = await bcrypt.hash(pass, 10);
        await db.query(`INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)`, [name, username, email, encryptedPass]);

        return {isError: false, message: "Usuario registrado"};
    } catch (err) {
        return {isError: true, message: "Error intendando registrar usuario!"};
    }
}

module.exports = {
    loggin,
    register
}