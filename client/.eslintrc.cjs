/** @type {import('eslint').Linter.Config} */
const config = {
	root: true,
	extends: '../.eslintrc.cjs',
	plugins: ['svelte3', '@typescript-eslint'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript')
	}
};

module.exports = config;
