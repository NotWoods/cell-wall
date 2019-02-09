import { readFile, writeFile } from 'fs';
import { Joi } from 'koa-joi-router';
import { join } from 'path';
import { promisify } from 'util';
import { Cell, CellModel, UUID, cellSchema } from './Cell';
import { ObservableSet } from './ObservableSet';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export interface WallModel {
    /**
     * Width of the wall
     */
    width: number;
    /**
     * Height of the wall
     */
    height: number;

    /**
     * Cells that have connected to the Wall
     */
    knownCells: Map<UUID, CellModel>;
    /**
     * UUIDs of cells currently connected to the Wall.
     */
    connectedCells: Set<UUID>;
}

export interface WallSerialized {
    width: number;
    height: number;
    knownCells: CellModel[];
}

export interface Wall extends WallModel, Iterable<CellModel> {
    ready: Promise<void>;
    showingPreview: boolean;
    connectedCells: ObservableSet<UUID>;
    toJSON(): WallSerialized;
    fromJSON(json: WallSerialized): this;
    centerCell(): CellModel | null;
    surroundingCells(): IterableIterator<CellModel>;
    getCell(uuid: UUID): CellModel | null;
    save(): Promise<void>;
}

class WallImpl implements Wall {
    private static readonly CACHE_PATH = join(
        __dirname,
        '../../.wall-cache.json',
    );

    ready = readFileAsync(WallImpl.CACHE_PATH, 'utf8')
        .then(JSON.parse)
        .then(json => {
            wall.fromJSON(json);
        })
        .catch(err => {
            if (err.code === 'ENOENT') {
                // don't care if cache doesn't exist yet
                return;
            }
            throw err;
        });

    width = 0;
    height = 0;
    knownCells = new Map<UUID, Cell>();
    connectedCells = new ObservableSet<UUID>();
    showingPreview = false;

    /**
     * Returns a serializable version of the Wall.
     */
    toJSON(): WallSerialized {
        return {
            width: this.width,
            height: this.height,
            knownCells: Array.from(this.knownCells.values()),
        };
    }

    /**
     * Deserializes a JSON representation of the Wall.
     */
    fromJSON(json: WallSerialized): this {
        this.width = json.width;
        this.height = json.height;
        for (const cell of json.knownCells) {
            const cellInst = Object.assign(new Cell(cell.id), cell);
            this.knownCells.set(cell.id, cellInst);
        }
        return this;
    }

    /**
     * Iterates through the currently connected cells.
     */
    *[Symbol.iterator]() {
        for (const uuid of this.connectedCells) {
            const cell = this.knownCells.get(uuid);
            if (cell != null) {
                yield cell;
            }
        }
    }

    /**
     * Finds the cell in the center of the screen.
     * Useful for some modes that show main information on one cell,
     * with background images on the other cells.
     */
    centerCell() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        let shortestDistanceSquared = Infinity;
        let closestCell: CellModel | null = null;
        for (const cell of this) {
            const distanceSquared =
                Math.pow(cell.position.x - centerX, 2) +
                Math.pow(cell.position.y - centerY, 2);
            if (distanceSquared < shortestDistanceSquared) {
                shortestDistanceSquared = distanceSquared;
                closestCell = cell;
            }
        }

        return closestCell;
    }

    *surroundingCells() {
        const center = this.centerCell();
        for (const cell of this) {
            if (cell !== center) {
                yield cell;
            }
        }
    }

    getCell(uuid: UUID) {
        return this.knownCells.get(uuid) || null;
    }

    async save() {
        try {
            await writeFileAsync(
                WallImpl.CACHE_PATH,
                JSON.stringify(wall, null, '  '),
                'utf8',
            );
        } catch (err) {
            console.warn('Error while saving cache:', err.message);
        }
    }
}

export const wall = new WallImpl();

export const wallSchema = Joi.object({
    width: Joi.number()
        .positive()
        .required(),
    height: Joi.number()
        .positive()
        .required(),
    knownCells: Joi.array()
        .required()
        .items(cellSchema),
});
