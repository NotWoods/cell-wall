import { readFile, writeFile } from 'fs';
import { Joi } from 'koa-joi-router';
import { join } from 'path';
import { Socket } from 'socket.io';
import { promisify } from 'util';
import { UUID } from '../models/Cell';
import { wall } from '../models/Wall';
import { difference } from '../util/itertools';
import { SocketSpec } from '../util/socket-spec';

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
 * connect
 * When an editor connects, reply with the current wall size and if a preview
 * is showing. Also reply with cells currently displayed.
 */
export const connectEditor: SocketSpec<null> = {
    event: 'connect',
    async handler(socket: Socket) {
        await ready;
        console.log('editor connected');

        socket.emit('resize-wall', { width: wall.width, height: wall.height });
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

        socket.on('disconnect', () => {
            wall.connectedCells.removeListener(onchange);
        });
    },
};

/**
 * move-cell
 * Move the location of a cell on the wall.
 */
export const editorMoveCell: SocketSpec<{
    id: string;
    x: number;
    y: number;
}> = {
    event: 'move-cell',
    validate: {
        params: {
            id: Joi.string().guid(),
            x: Joi.number(),
            y: Joi.number(),
        },
    },
    handler(socket, data) {
        const cell = wall.knownCells.get(data.id);
        if (cell != null) {
            cell.position.x = data.x;
            cell.position.y = data.y;
            socket.broadcast.emit('move-cell', data);
            saveWall();
        }
    },
};

/**
 * resize-wall
 * Change the dimensions of the wall. 1-2 dimensions may be specified.
 */
export const editorResizeWall: SocketSpec<{
    width?: number;
    height?: number;
}> = {
    event: 'resize-wall',
    validate: {
        params: {
            width: Joi.number(),
            height: Joi.number(),
        },
    },
    handler(socket, opts) {
        if (opts.width != null) wall.width = opts.width;
        if (opts.height != null) wall.height = opts.height;

        socket.broadcast.emit('resize-wall', opts);
        saveWall();
    },
};

/**
 * showing-preview
 * Toggle the "Show preview" mode of the wall, which displays a background image.
 */
export const editorShowPreview: SocketSpec<boolean> = {
    event: 'showing-preview',
    validate: {
        params: Joi.boolean(),
    },
    handler(socket: Socket, show: boolean) {
        wall.showingPreview = show;
        socket.broadcast.emit('showing-preview', show);
        saveWall();
    },
};
