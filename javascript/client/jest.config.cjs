/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	transform: {
		'^.+\\.(j|t)sx?$': 'esbuild-jest',
		'^.+\\.svelte$': ['svelte-jester', { preprocess: true }]
	},
	setupFiles: ['./jest.setup.ts'],
	moduleFileExtensions: ['ts', 'js', 'svelte'],
	testEnvironment: 'jsdom'
};

module.exports = config;
