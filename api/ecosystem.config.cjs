module.exports = {
	apps: [
		{
			name: 'todo-api',
			script: './src/index.ts',
			interpreter: './node_modules/.bin/tsx',
			instances: 1,
			exec_mode: 'cluster',
			env: {
				NODE_ENV: 'production',
				PORT: 8000,
			},
			error_file: './logs/err.log',
			out_file: './logs/out.log',
			log_file: './logs/combined.log',
			time: true,
		},
	],
};
