import { Joi } from 'koa-joi-router';
import { Socket } from 'socket.io';
import { UUID } from '../models/Cell';
import { Wall } from '../models/Wall';
import { difference } from '../util/itertools';
import { SocketSpec } from '../util/socket-spec';

/**
 * connect
 * When an editor connects, reply with the current wall size and if a preview
 * is showing. Also reply with cells currently displayed.
 */
export function connectEditor(wall: Wall): SocketSpec<null> {
    return {
        event: 'connect',
        async handler(socket: Socket) {
            await wall.ready;
            console.log('editor connected');

            socket.emit('resize-wall', {
                width: wall.width,
                height: wall.height,
            });
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
}

/**
 * move-cell
 * Move the location of a cell on the wall.
 */
export function editorMoveCell(
    wall: Wall,
): SocketSpec<{
    id: string;
    x: number;
    y: number;
}> {
    return {
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
                wall.save();
            }
        },
    };
}

/**
 * resize-wall
 * Change the dimensions of the wall. 1-2 dimensions may be specified.
 */
export function editorResizeWall(
    wall: Wall,
): SocketSpec<{
    width?: number;
    height?: number;
}> {
    return {
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
            wall.save();
        },
    };
}

/**
 * showing-preview
 * Toggle the "Show preview" mode of the wall, which displays a background image.
 */
export function editorShowPreview(wall: Wall): SocketSpec<boolean> {
    return {
        event: 'showing-preview',
        validate: {
            params: Joi.boolean(),
        },
        handler(socket: Socket, show: boolean) {
            wall.showingPreview = show;
            socket.broadcast.emit('showing-preview', show);
            wall.save();
        },
    };
}
