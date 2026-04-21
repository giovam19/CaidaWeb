import mysql, {ConnectionOptions, QueryValues, RowDataPacket} from 'mysql2/promise'

async function query(sql: string, params: QueryValues): Promise<RowDataPacket[]> {
    const access: ConnectionOptions = {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!),
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!
    };

    const connection = await mysql.createConnection(access);
    const [results] = await connection.query<RowDataPacket[]>(sql, params);

    return results;
}

export = {
    query
};