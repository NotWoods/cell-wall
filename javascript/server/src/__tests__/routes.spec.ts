import { describe, expect, it } from 'vitest';
import { readdir, readFile, stat } from 'fs/promises';
import { parse, posix, relative, resolve, win32 } from 'path';

const DYNAMIC_IMPORT = /import\('([-.\w[\]/]+)'\)/g;
const srcFolder = resolve(__dirname, '../');

async function getFiles(dir: string): Promise<string[]> {
	const subdirs = await readdir(dir);
	const files = await Promise.all(
		subdirs.map(async (subdir) => {
			const res = resolve(dir, subdir);
			const stats = await stat(res);
			return stats.isDirectory() ? getFiles(res) : res;
		})
	);
	return files.flat();
}

describe('routes subsystem', () => {
	it('imports all routes', async () => {
		const actualFiles = await getFiles(resolve(srcFolder, 'routes'));
		const routeFiles = actualFiles
			.filter((path) => {
				const { name, ext } = parse(path);
				return !name.startsWith('_') && ext === '.ts';
			})
			.map((path) => relative(srcFolder, path))
			.map((path) => `./${path.replaceAll(win32.sep, posix.sep)}`);

		const subsystemFile = await readFile(resolve(srcFolder, 'routes.ts'), 'utf8');
		const imports = Array.from(subsystemFile.matchAll(DYNAMIC_IMPORT), (match) => `${match[1]}.ts`);

		expect(new Set(imports)).toEqual(new Set(routeFiles));
	});
});
