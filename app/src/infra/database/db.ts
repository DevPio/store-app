import { Pool } from 'pg'

export const db = new Pool({
    host: 'db',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})