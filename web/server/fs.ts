import { watch, readFile, writeFile, access, constants } from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const accessAsync = promisify(access);

export {
    readFileAsync as readFile,
    writeFileAsync as writeFile,
    accessAsync as access,
};

/**
 * Ensures that a file exists.
 * @param path Path to check.
 * @param elseWrite If the file does not exist, writes this value.
 */
export async function ensureFile(
    path: string,
    elseWrite: () => string = () => '',
): Promise<void> {
    try {
        await accessAsync(path, constants.F_OK);
    } catch (err) {
        await writeFileAsync(path, elseWrite(), { encoding: 'utf8' });
    }
}

/**
 * Reads JSON data from a file.
 */
export async function readJson(
    path: string | number | Buffer,
): Promise<unknown> {
    const json = await readFileAsync(path, { encoding: 'utf8' });
    return JSON.parse(json);
}

/**
 * Writes JSON data to a file.
 */
export async function writeJson(
    path: string | number | Buffer,
    json: unknown,
): Promise<void> {
    const text = JSON.stringify(json);
    await writeFileAsync(path, text, { encoding: 'utf8' });
}

/**
 * Watch for changes on a file, and call a listener with the new data from the file.
 */
export function watchJson(path: string, listener: (data: unknown) => void) {
    return watch(path, { encoding: 'utf8' }, async (_eventType, filename) => {
        listener(await readJson(filename));
    });
}
