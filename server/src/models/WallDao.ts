import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import { CellModel } from './Cell';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export interface WallSerialized {
    width: number;
    height: number;
    knownCells: CellModel[];
}

export class WallDao {
    constructor(private readonly cachePath: string) {}

    async read(): Promise<WallSerialized | null> {
        try {
            const text = await readFileAsync(this.cachePath, 'utf8');
            return JSON.parse(text);
        } catch (err) {
            if (err.code === 'ENOENT') {
                // don't care if cache doesn't exist yet
                return null;
            }
            throw err;
        }
    }

    async write(wall: WallSerialized) {
        try {
            await writeFileAsync(
                this.cachePath,
                JSON.stringify(wall, null, '  '),
                'utf8',
            );
        } catch (err) {
            console.warn('Error while saving cache:', err.message);
        }
    }
}
