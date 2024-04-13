// db.js

// 使用mysql2
import mysql from 'mysql2/promise';
// 引入mysql配置文件
import { connectionConfig } from './config.js';

async function executeQuery(query, params = []) {
    const connection = await mysql.createConnection(connectionConfig);

    try {
        const [results] = await connection.query(query, params);
        return results;
    } finally {
        await connection.end();
    }
}
export default async function fetchSomeData(sql, params = []) {
    try {
        const results = await executeQuery(sql, params);
        console.log('Query results:', results);
    } catch (error) {
        console.error('Error executing query:', error);
    }
}

