import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: node({
			entryPoint: 'src/server/index.js',
			esbuild(defaultOptions) {
				return {
					...defaultOptions,
					external: Object.keys(
						JSON.parse(readFileSync('package.json', 'utf8')).dependencies || {}
					),
					target: 'node16',
					plugins: [
						defaultOptions.outfile.endsWith('index.js')
							? {
									// Update from unpublished version of adapter-node
									name: 'fix-middlewares-exclude',
									setup(build) {
										// Match an import of "middlewares.js" and mark it as external
										const internal_middlewares_path = resolve('.svelte-kit/node/middlewares.js');
										const out = dirname(defaultOptions.outfile);
										const build_middlewares_path = resolve(out, 'middlewares.js');
										build.onResolve({ filter: /\/middlewares\.js$/ }, ({ path, resolveDir }) => {
											const resolved = resolve(resolveDir, path);
											if (
												resolved === internal_middlewares_path ||
												resolved === build_middlewares_path
											) {
												return { path: './middlewares.js', external: true };
											}
										});
									}
							  }
							: undefined
					].filter(Boolean)
				};
			}
		}),
		vite: {
			ssr: {
				noExternal: ['lowdb']
			}
		}
	}
};

export default config;
