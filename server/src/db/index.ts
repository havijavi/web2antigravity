
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _pool: mysql.Pool | null = null;

export function getDb() {
    if (!_db) {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) throw new Error("DATABASE_URL not set");

        // Create pool if not exists
        if (!_pool) {
            _pool = mysql.createPool({
                uri: databaseUrl,
                ssl: { rejectUnauthorized: false },
                connectionLimit: 10,
                waitForConnections: true,
                queueLimit: 0
            });
        }

        // @ts-ignore
        _db = drizzle(_pool, { schema, mode: 'default' });
    }
    return _db;
}

// Export a proxy that lazy initializes the DB on first access
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
    get: (_, prop) => {
        const database = getDb();
        // @ts-ignore
        const value = database[prop];
        if (typeof value === 'function') {
            // @ts-ignore
            return value.bind(database);
        }
        return value;
    },
});
