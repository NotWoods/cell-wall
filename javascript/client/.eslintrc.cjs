/** @type {import('eslint').Linter.Config} */
const config = {
	root: true,
	extends: ['plugin:svelte/recommended', 'plugin:svelte/prettier', '../.eslintrc.cjs'],
	parserOptions: {
		project: require.resolve('./tsconfig.json'),
		extraFileExtensions: ['.svelte']
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: { parser: '@typescript-eslint/parser' }
		}
	],
	settings: {
		'svelte/typescript': () => require('typescript')
	}
};

module.exports = config;
