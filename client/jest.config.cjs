const esModules = {};

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	transform: {
		'^.+\\.(j|t)sx?$': 'esbuild-jest'
	},
	// Map modules without a "main" field
	moduleNameMapper: esModules,
	setupFiles: ['./src/jest.setup.ts']
};

module.exports = config;
