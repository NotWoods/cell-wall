// @ts-check
import { builtinModules } from 'module';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import autoPreprocess from 'svelte-preprocess';

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    format: 'esm',
    file: 'dist/bundle.js',
  },
  plugins: [
    svelte({
      // @ts-ignore
      dev: true,
      preprocess: autoPreprocess(),
    }),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    typescript(),
  ],
};

export default config;
