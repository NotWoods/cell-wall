import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');

/** @type {import('rollup').RollupOptions} */
const serverConfig = {
    input: 'src/server.ts',
    output: {
        dir: 'lib',
        format: 'cjs',
        sourcemap: true,
    },
    plugins: [typescript(), resolve(), commonjs(), terser()],
    external: ['http', 'fs', 'util', 'path', ...Object.keys(pkg.dependencies)],
};

/** @type {import('rollup').RollupOptions} */
const homeConfig = {
    input: 'src/web/home/index.ts',
    output: {
        file: 'public/home.js',
        format: 'esm',
        sourcemap: true,
    },
    plugins: [typescript(), resolve(), commonjs(), terser()],
};

/** @type {import('rollup').RollupOptions} */
const editorConfig = {
    input: 'src/web/editor/index.ts',
    output: {
        file: 'public/editor/editor.js',
        format: 'esm',
        sourcemap: true,
    },
    plugins: [
        typescript(),
        replace({
            'socket.io-client': 'socket.io-client/dist/socket.io.slim.js',
        }),
        resolve(),
        commonjs(),
    ],
};

export default [serverConfig, homeConfig, editorConfig];
