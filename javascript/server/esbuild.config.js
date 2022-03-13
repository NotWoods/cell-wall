// @ts-check
import { build } from 'esbuild';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const devMode = process.argv.includes('--dev');

build({
	entryPoints: [devMode ? 'src/dev.ts' : 'src/index.ts'],
	bundle: true,
	outdir: 'build',
	platform: 'node',
	target: 'node16',
	format: 'esm',
	external: [...Object.keys(pkg.dependencies), 'fastify-reply-from'],
	define: {
		'process.env': JSON.stringify({ NODE_ENV: devMode ? 'development' : 'production' })
	}
}).catch(() => process.exit(1));
