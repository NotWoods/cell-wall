import { Context } from 'koa';
import { Joi, Spec } from 'koa-joi-router';
import { Socket } from 'socket.io';
import { Cell, cellSchema } from '../models/Cell';
import { CellState, cellStateSchema } from '../models/CellState';
import { Wall } from '../models/Wall';
import { SocketSpec } from '../util/socket-spec';

/**
 * GET /cell/:uuid
 * Returns the current state of the cell.
 */
export function getState(wall: Wall): Spec {
    return {
        method: 'GET',
        path: '/cell/:uuid',
        validate: {
            params: {
                uuid: Joi.string().guid(),
            },
            output: {
                200: { body: cellStateSchema },
                404: { body: Joi.any() },
            },
        },
        async handler(ctx: Context) {
            const cell = wall.getCell(ctx.params.uuid);
            if (cell == null) {
                ctx.status = 404; // ID was incorrect
            } else {
                ctx.body = cell.state;
            }
        },
    };
}

/**
 * PUT /cell/:uuid
 * Register a new cell with the given data
 */
export function putCell(wall: Wall): Spec {
    return {
        method: 'PUT',
        path: '/cell/:uuid',
        validate: {
            params: {
                uuid: Joi.string().guid(),
            },
            type: 'json',
            body: {
                deviceName: Joi.string().required(),
                density: Joi.number()
                    .positive()
                    .required(),
                widthPixels: Joi.number()
                    .positive()
                    .required(),
                heightPixels: Joi.number()
                    .positive()
                    .required(),
            },
            output: {
                '200,201': { body: cellSchema },
            },
        },
        async handler(ctx: Context) {
            const { uuid } = ctx.params;
            const existingCell = wall.getCell(uuid);
            let cell = existingCell;
            if (cell == null) {
                cell = new Cell(uuid);
            }
            cell.deviceName = ctx.request.body.deviceName;
            cell.display = {
                density: ctx.request.body.density,
                heightPixels: ctx.request.body.heightPixels,
                widthPixels: ctx.request.body.widthPixels,
            };
            wall.knownCells.set(uuid, cell);
            wall.save();

            console.info(
                `${
                    existingCell != null ? 'Updated' : 'Added'
                } cell [${uuid}]\n` +
                    `  ${cell.deviceName}\n` +
                    `  Position: ${JSON.stringify(cell.position)}\n` +
                    `  Display: ${JSON.stringify(cell.display)}\n`,
            );

            // Respond with 201 if new cell was created
            ctx.status = existingCell != null ? 200 : 201;
            ctx.body = cell instanceof Cell ? cell.toJSON() : cell;
        },
    };
}

export function connectCell(wall: Wall): SocketSpec<null> {
    return {
        event: 'connect',
        validate: {
            query: {
                uuid: Joi.string().guid(),
            },
        },
        handler(socket: Socket) {
            const uuid = socket.handshake.query.uuid as string;

            console.log(`Cell connected [${uuid}]`);

            function handleUpdate(state: CellState) {
                socket.emit('cell-update', state);
            }

            wall.connectedCells.add(uuid);
            const cell = wall.knownCells.get(uuid) as Cell;
            if (cell != null) {
                console.log(`  ${cell.deviceName}`);
                cell.onchange = handleUpdate;
                handleUpdate(cell.state);
            } else {
                console.warn(`  Cell is unknown, register first`);
            }

            socket.on('disconnect', () => {
                if (cell != null) {
                    console.log(
                        `Cell disconnected - ${cell.deviceName} [${uuid}]`,
                    );
                    delete cell.onchange;
                } else {
                    console.log(`Cell disconnected - <unknown> [${uuid}]`);
                }
                wall.connectedCells.delete(uuid);
            });
        },
    };
}
