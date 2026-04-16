const mysql = require('mysql2/promise');

async function query(sql, params) {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    const [results, ] = await connection.query(sql, params);

    return results;
}

module.exports = {
    query
}