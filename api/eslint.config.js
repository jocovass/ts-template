import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import vitest from '@vitest/eslint-plugin';

export default tseslint.config(
	{
		ignores: [
			'**/node_modules/**',
			'**/dist/**',
			'**/build/**',
			'**/database/**',
			'**/src/models/drizzle/**',
			'**/*.js',
			'ecosystem.config.cjs',
		],
	},
	eslint.configs.recommended,
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	eslintConfigPrettier,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	perfectionist.configs['recommended-natural'],
	{
		files: ['**/*.test.ts', '**/*.spec.ts'],
		plugins: {
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules,
			'@typescript-eslint/unbound-method': 'off',
		},
	},
	{
		rules: {
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
		},
	},
);
