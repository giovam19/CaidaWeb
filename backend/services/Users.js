const db = require('../db/db');
const helper = require('../helper');
const bcrypt = require('bcryptjs');

async function loggin(email, pass) {
    try {
        const rows = await db.query(
            `SELECT id, username, email, password FROM users WHERE email = ?`,
            [email]
        );    
        var data = validateLogin(rows, pass);
    
        return data;
    } catch (err) {
        console.error(err);
        return {isError: true, message: "Error intentando logear al usuario. Por favor, intente más tarde"};
    }   
}

async function register(email, name, username, pass) {
    try {
        var emailExists = await existEmail(email);
        if (emailExists) {
            return {isError: true, message: "Usuario ya existe con estes email. Por favor, intente con otro email o inicie sesión si ya está registrado"};
        }

        var usernameExists = await existUsername(username);
        if (usernameExists) {
            return {isError: true, message: "Usuario ya existe con estes nombre de usuario. Por favor, intente con otro nombre de usuario"};
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPass = await bcrypt.hash(pass, salt);
        await db.query(`INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)`, [name, username, email, encryptedPass]);

        return {isError: false, message: "Usuario registrado"};
    } catch (err) {
        console.error(err);
        return {isError: true, message: "Error intentando registrar al usuario. Por favor, intente más tarde"};
    }
}

async function existEmail(email) {
    const rows = await db.query(`SELECT email FROM users WHERE email = ?`, [email]);
    var data = helper.emptyOrRows(rows);

    if (data.length > 0) {
        return true;
    }
        
    return false;
}

async function existUsername(username) {
    const rows = await db.query(`SELECT username FROM users WHERE username = ?`, [username]);
    var data = helper.emptyOrRows(rows);

    if (data.length > 0) {
        return true;
    }
        
    return false;
}

function validateLogin(rows, pass) {
    const data = helper.emptyOrRows(rows);

    if ( data == [] || data.length == 0) {
        return {isError: true, user: null, message: "Email no encontrado."};
    }
    
    const {id, username, email, password} = data[0];
    const validPass = bcrypt.compareSync(pass, password);

    if (validPass) {
        return { isError: false, user: {id, username, email}, message: "Usuario logeado"};
    }

    return { isError: true, user: null, message: "Contraseña incorrecta!" };
}

module.exports = {
    loggin,
    register
}