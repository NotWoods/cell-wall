// @ts-check
import { build } from 'esbuild';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

build({
	entryPoints: ['src/index.ts'],
	bundle: true,
	outdir: 'build',
	platform: 'node',
	target: 'node16',
	format: 'esm',
	external: Object.keys(pkg.dependencies)
}).catch(() => process.exit(1));
