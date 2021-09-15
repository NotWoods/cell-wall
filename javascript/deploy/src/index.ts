import { builtinModules } from 'module';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import { OutputOptions, rollup, RollupOptions } from 'rollup';

interface FileOptions {
  input: string;
  out: string;
  cwd?: string;
}

interface GetConfigOptions extends FileOptions {
  pkg?: string;
}

async function readJson(path: string, cwd: string) {
  return JSON.parse(await readFile(resolve(cwd, path), 'utf8'));
}

async function getConfig({
  pkg = 'package.json',
  input,
  out,
  cwd = process.cwd(),
}: GetConfigOptions): Promise<RollupOptions> {
  const { dependencies } = await readJson(pkg, cwd);

  return {
    input: resolve(cwd, input!),
    output: {
      file: resolve(cwd, out!),
      format: 'es',
      exports: 'named',
    },
    external: [...builtinModules, ...Object.keys(dependencies)],
    plugins: [nodeResolve(), commonjs(), json()],
  };
}

export async function bundle(args: GetConfigOptions) {
  const config = await getConfig(args);
  const bundle = await rollup(config);
  return await bundle.write(config.output as OutputOptions);
}

export async function pkg({ input, out, cwd = process.cwd() }: FileOptions) {
  const { devDependencies, main, types, ava, ...packageJson } = await readJson(
    input,
    cwd,
  );
  const json = JSON.stringify(packageJson, undefined, 2);
  await writeFile(resolve(cwd, out), json, 'utf8');
}
