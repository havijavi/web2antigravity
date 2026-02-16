"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.getDb = getDb;
var mysql2_1 = require("drizzle-orm/mysql2");
var promise_1 = require("mysql2/promise");
var schema = require("./schema");
var _db = null;
var _pool = null;
function getDb() {
    if (!_db) {
        var databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl)
            throw new Error("DATABASE_URL not set");
        // Create pool if not exists
        if (!_pool) {
            _pool = promise_1.default.createPool({
                uri: databaseUrl,
                ssl: { rejectUnauthorized: false },
                connectionLimit: 10,
                waitForConnections: true,
                queueLimit: 0
            });
        }
        _db = (0, mysql2_1.drizzle)(_pool, { schema: schema, mode: 'default' });
    }
    return _db;
}
// Export a proxy that lazy initializes the DB on first access
exports.db = new Proxy({}, {
    get: function (_, prop) {
        var database = getDb();
        // @ts-ignore
        var value = database[prop];
        if (typeof value === 'function') {
            // @ts-ignore
            return value.bind(database);
        }
        return value;
    },
});
