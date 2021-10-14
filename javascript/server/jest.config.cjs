const esModules = {
	lowdb: 'lowdb/lib/index.js',
	steno: 'steno/lib/index.js'
};

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	transform: {
		'^.+\\.(j|t)sx?$': 'esbuild-jest'
	},
	// Transform ES modules
	transformIgnorePatterns: [
		`node_modules/(?!${Object.keys(esModules).join('|')})/`,
		'\\.pnp\\.[^\\/]+$'
	],
	// Map modules without a "main" field
	moduleNameMapper: esModules,
	setupFiles: ['./src/jest.setup.ts']
};

module.exports = config;
