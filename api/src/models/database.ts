import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schemas from './schemas.js';

const dbUrl = new URL(process.env.DB_URL);
console.log(dbUrl);
const client = new Pool({
	database: dbUrl.pathname.slice(1),
	host: dbUrl.hostname,
	password: dbUrl.password,
	port: parseInt(dbUrl.port),
	ssl:
		process.env.NODE_ENV === 'development'
			? false
			: {
					rejectUnauthorized: false,
				},
	user: dbUrl.username,
});
export const db = drizzle(client, { schema: schemas });

export type DB = typeof db;
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

process.on('SIGINT', () => {
	client.end().then(() => {
		process.exit(0);
	});
});
