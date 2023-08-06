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
			parserOptions: { parser: '@typescript-eslint/parser' },
			rules: {
				'svelte/block-lang': ['error', { script: 'ts' }],
				'svelte/button-has-type': 'error',
				'svelte/no-dupe-on-directives': 'error',
				'svelte/no-dupe-use-directives': 'error',
				'svelte/no-export-load-in-svelte-module-in-kit-pages': 'error',
				'svelte/no-immutable-reactive-statements': 'error',
				'svelte/no-reactive-functions': 'error',
				'svelte/no-reactive-literals': 'error',
				'svelte/no-reactive-reassign': 'error',
				'svelte/no-target-blank': 'error',
				'svelte/no-useless-mustaches': 'error',
				'svelte/require-event-dispatcher-types': 'error',
				'svelte/require-optimized-style-attribute': 'error',
				'svelte/require-store-reactive-access': 'error',
				'svelte/valid-each-key': 'error',
				'svelte/valid-prop-names-in-kit-pages': 'error',
				'no-inner-declarations': 'off'
			}
		}
	],
	settings: {
		'svelte/typescript': () => require('typescript')
	}
};

module.exports = config;
