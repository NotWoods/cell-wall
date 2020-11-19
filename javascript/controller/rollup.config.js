// @ts-check
const { builtinModules } = require('module');
const { writeFile } = require('fs/promises');
const { rollup } = require('rollup');
const svelte = require('rollup-plugin-svelte');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const autoPreprocess = require('svelte-preprocess');

/** @type {import('rollup').OutputOptions} */
const outputOptions = {
  sourcemap: true,
  format: 'iife',
  file: 'dist/bundle.js',
};

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/index.ts',
  output: outputOptions,
  external: builtinModules,
  plugins: [
    svelte({
      // @ts-ignore
      dev: true,
      preprocess: autoPreprocess(),
    }),
    nodeResolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    typescript(),
  ],
};

module.exports = config;

async function compile() {
  const bundle = await rollup(config);
  const { output } = await bundle.generate(outputOptions);

  const [{ code }] = output;
  const wrapper = `const code = \`${code.replace(
    /(`|\$|\\)/g,
    '\\$&',
  )}\`; export default code`;
  await writeFile('dist/script.js', wrapper, 'utf8');
  return code;
}
compile();
