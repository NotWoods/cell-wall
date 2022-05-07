/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	transform: {
		'^.+\\.(j|t)sx?$': 'esbuild-jest'
	},
	// Transform ES modules
	transformIgnorePatterns: ['\\.pnp\\.[^\\/]+$'],
	setupFiles: ['./jest.setup.ts']
};

module.exports = config;
