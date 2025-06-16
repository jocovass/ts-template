import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';

async function main() {
	const client = new Client({
		connectionString: process.env.DB_URL,
	});

	await client.connect();
	const db = drizzle(client);

	try {
		await migrate(db, { migrationsFolder: './src/models/drizzle' });
		console.log('✅ Migration completed');
	} catch (e) {
		console.error('💥 Error during migraton: ', e);
		process.exit(1);
	} finally {
		await client.end();
	}
}

await main();
