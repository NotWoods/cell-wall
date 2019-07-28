import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');

/** @type {import('rollup').RollupOptions} */
const serverConfig = {
    input: 'web/server/index.ts',
    output: {
        file: 'web/build/server.js',
        format: 'cjs',
        sourcemap: true,
    },
    plugins: [typescript({ tsconfig: 'web/server/tsconfig.json' })],
    external: ['http', 'fs', 'util', 'path', ...Object.keys(pkg.dependencies)],
};

/**
 * Generate a rollup config for client-facing scripts.
 * @param {string} options.input
 * @param {string} options.output
 * @param {import('rollup').Plugin[]} options.plugins
 * @returns {import('rollup').RollupOptions}
 */
function clientConfig(options) {
    return {
        input: `web/${options.input}/index.ts`,
        output: {
            file: options.output,
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            typescript({ tsconfig: `web/${options.input}/tsconfig.json` }),
            ...options.plugins,
        ],
    };
}

const homeConfig = clientConfig({
    input: 'remote',
    output: 'web/public/build_remote.js',
    plugins: [terser()],
});

const editorConfig = clientConfig({
    input: 'editor',
    output: 'web/public/editor/build_editor.js',
    plugins: [
        replace({
            interactjs: 'interactjs/dist/interact.min.js',
            'socket.io-client': 'socket.io-client/dist/socket.io.slim.js',
        }),
        resolve(),
        commonjs(),
    ],
});

export default [serverConfig, homeConfig, editorConfig];
