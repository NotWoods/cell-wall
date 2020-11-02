import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'index.js',
  output: {
    file: 'dist/cell-wall.js',
    format: 'cjs',
  },
  plugins: [nodeResolve(), commonjs(), json()],
};

export default config;
