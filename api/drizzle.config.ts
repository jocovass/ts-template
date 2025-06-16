import { type Config } from 'drizzle-kit';

import { init } from './src/utils/validations/initEnv';

init();

export default {
	dbCredentials: {
		url: process.env.DB_URL,
	},
	dialect: 'postgresql',
	out: './src/models/drizzle',
	schema: './src/models/schemas.ts',
} satisfies Config;
