const esModules = {};

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	transform: {
		'^.+\\.(j|t)sx?$': 'esbuild-jest',
		'^.+\\.svelte$': ['svelte-jester', { preprocess: true }]
	},
	// Map modules without a "main" field
	moduleNameMapper: esModules,
	setupFiles: ['./src/jest.setup.ts'],
	moduleFileExtensions: ['ts', 'js', 'svelte'],
	testEnvironment: 'jsdom'
};

module.exports = config;
