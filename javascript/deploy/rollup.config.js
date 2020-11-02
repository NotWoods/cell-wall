import { builtinModules } from 'module';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';

const pkg = require('./package.json');

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'index.js',
  output: {
    file: 'dist/cell-wall.js',
    format: 'cjs',
    exports: 'default',
  },
  external: [...builtinModules, ...Object.keys(pkg.dependencies)],
  plugins: [nodeResolve(), commonjs(), json()],
};

export default config;
