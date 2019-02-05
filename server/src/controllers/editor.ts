import { readFile, writeFile } from 'fs';
import { Joi } from 'koa-joi-router';
import { join } from 'path';
import { Socket } from 'socket.io';
import { promisify } from 'util';
import { UUID } from '../models/Cell';
import { wall } from '../models/Wall';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

const CACHE_PATH = join(__dirname, '../../.wall-cache.json');

const ready = readFileAsync(CACHE_PATH, 'utf8')
    .then(JSON.parse)
    .then(json => wall.fromJSON(json))
    .catch(err => {
        if (err.code === 'ENOENT') {
            // don't care if cache doesn't exist yet
            return;
        }
        throw err;
    });

export async function saveWall() {
    try {
        await writeFileAsync(
            CACHE_PATH,
            JSON.stringify(wall, null, '  '),
            'utf8',
        );
    } catch (err) {
        console.warn('Error while saving cache:', err.message);
    }
}

/**
 * Return elements of set a that are not in set b.
 */
function difference<T>(a: Set<T>, b: Set<T>): T[] {
    return [...a].filter(x => !b.has(x));
}

const moveCellSchema = {
    id: Joi.string().guid(),
    x: Joi.number(),
    y: Joi.number(),
};

const resizeWallSchema = Joi.array()
    .length(2)
    .items(Joi.only('width', 'height'), Joi.number());

const showingPreviewSchema = Joi.boolean();

export const connectEditor = async (socket: Socket) => {
    await ready;
    console.log('editor connected');

    socket.emit('resize-wall', 'width', wall.width);
    socket.emit('resize-wall', 'height', wall.height);
    socket.emit('show-preview', wall.showingPreview);

    let connected = new Set<UUID>();
    function onchange(items: Set<UUID>) {
        if (items.size > connected.size) {
            const newCells = difference(items, connected);
            for (const id of newCells) {
                const cell = wall.knownCells.get(id);
                if (cell != null) {
                    socket.emit('add-cell', cell);
                }
            }
        } else if (items.size < connected.size) {
            const deletedCells = difference(connected, items);
            for (const id of deletedCells) {
                if (wall.knownCells.has(id)) {
                    socket.emit('delete-cell', id);
                }
            }
        }

        connected = new Set(items);
    }
    onchange(wall.connectedCells);
    wall.connectedCells.addListener(onchange);

    socket.on('move-cell', async data => {
        await Joi.validate(data, moveCellSchema);

        const cell = wall.knownCells.get(data.id);
        if (cell != null) {
            cell.position.x = data.x;
            cell.position.y = data.y;
            socket.broadcast.emit('move-cell', data);
            saveWall();
        }
    });
    socket.on('resize-wall', async (dimension: 'width' | 'height', value) => {
        await Joi.validate([dimension, value], resizeWallSchema);

        wall[dimension] = value;
        socket.broadcast.emit('resize-wall', dimension, value);
        saveWall();
    });
    socket.on('showing-preview', async show => {
        await Joi.validate(show, showingPreviewSchema);

        wall.showingPreview = show;
        socket.broadcast.emit('showing-preview', show);
        saveWall();
    });

    socket.on('disconnect', () => {
        wall.connectedCells.removeListener(onchange);
    });
};
