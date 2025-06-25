import { z } from 'zod';

const schema = z.object({
	APP_USER: z.string(),
	DB_HOST: z.string(),
	DB_NAME: z.string(),
	DB_PASSWORD: z.string(),
	DB_PORT: z.string(),
	DB_SSL: z.string(),
	DB_TIMEZONE: z.string(),
	DB_URL: z.string(),
	DB_USER: z.string(),
	ENV: z.enum(['production', 'development', 'test'] as const),
	FRONTEND_URL: z.string(),
	NODE_ENV: z.enum(['production', 'development', 'test'] as const),
});

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof schema> {}
	}
}

export function init(): void {
	const parsedEnv = schema.safeParse(process.env);

	if (!parsedEnv.success) {
		console.error(
			'❌ Invalid environment variables: ',
			parsedEnv.error.flatten().fieldErrors,
		);

		throw new Error('Invalid environment varaibles');
	}
	return;
}
