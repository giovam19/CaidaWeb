import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs"
import db from "../db/db"
import { EmptyOrRows } from "../helper";
import { LogginResponse, RegisterResponse } from "../../shared/DTO/ResponseDTO";

interface User extends RowDataPacket {
    id: string;
    username: string;
    email: string;
    password: string;
}

async function loggin(email: string, pass: string): Promise<LogginResponse> {
    try {
        const rows = await db.query(
            `SELECT id, username, email, password FROM users WHERE email = ?`,
            [email]
        ) as User[];    
        var data = validateLogin(rows, pass);
    
        return data;
    } catch (err) {
        console.error(err);
        return {isError: true, user: null, message: "Error intentando logear al usuario. Por favor, intente más tarde"};
    }   
}

async function register(email: string, name: string, username: string, pass: string): Promise<RegisterResponse> {
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

async function existEmail(email: string) {
    const rows = await db.query(`SELECT email FROM users WHERE email = ?`, [email]) as User[];
    var data = EmptyOrRows(rows) as User[];

    if (data.length > 0) {
        return true;
    }
        
    return false;
}

async function existUsername(username: string) {
    const rows = await db.query(`SELECT username FROM users WHERE username = ?`, [username]) as User[];
    var data = EmptyOrRows(rows) as User[];

    if (data.length > 0) {
        return true;
    }
        
    return false;
}

function validateLogin(rows: User[], pass: string): LogginResponse {
    const data = EmptyOrRows(rows) as User[];

    if (data.length == 0) {
        return {isError: true, user: null, message: "Email no encontrado."};
    }
    
    const userData = data[0];
    const validPass = bcrypt.compareSync(pass, userData!.password);

    if (validPass) {
        return { isError: false, user: {id: userData!.id, username: userData!.username, email: userData!.email}, message: "Usuario logeado"};
    }

    return { isError: true, user: null, message: "Contraseña incorrecta!" };
}

export = {
    loggin,
    register
}