import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schemas from './schemas.js';

const client = new Pool({ connectionString: process.env.DB_URL });
export const db = drizzle(client, { schema: schemas });

export type DB = typeof db;
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

process.on('SIGINT', () => {
	client.end().then(() => {
		process.exit(0);
	});
});
