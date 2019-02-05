import { Joi, Spec } from 'koa-joi-router';
import { Context } from 'koa';
import { Socket } from 'socket.io';
import { wall } from '../models/Wall';
import { Cell } from '../models/Cell';
import { CellState } from '../models/CellState';
import { saveWall } from './editor';

/**
 * GET /cell/:uuid
 * Returns the current state of the cell.
 */
export const getState: Spec = {
    method: 'GET',
    path: '/cell/:uuid',
    validate: {
        params: {
            uuid: Joi.string().guid(),
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

/**
 * PUT /cell/:uuid
 * Register a new cell with the given data
 */
export const putCell: Spec = {
    method: 'PUT',
    path: '/cell/:uuid',
    validate: {
        params: {
            uuid: Joi.string().guid(),
        },
        query: {
            deviceName: Joi.string(),
            widthPixels: Joi.number(),
            heightPixels: Joi.number(),
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
        saveWall();

        console.info(
            `${existingCell != null ? 'Updated' : 'Added'} cell [${uuid}]\n` +
                `  ${cell.deviceName}\n` +
                `  Position: ${JSON.stringify(cell.position)}\n` +
                `  Display: ${JSON.stringify(cell.display)}\n`,
        );

        // Respond with 201 if new cell was created
        ctx.status = existingCell != null ? 200 : 201;
        ctx.body = cell;
    },
};

export const connectCell = async (socket: Socket) => {
    const { uuid } = await Joi.validate(
        socket.handshake.query,
        connectCell.schema.query,
    );

    console.log(`Cell connected [${uuid}]`);

    function handleUpdate(state: CellState) {
        socket.emit('cell-update', state);
    }

    wall.connectedCells.add(uuid);
    const cell = wall.knownCells.get(uuid);
    if (cell != null) {
        console.log(`  ${cell.deviceName}`);
        cell.onchange = handleUpdate;
        handleUpdate(cell.state);
    } else {
        console.warn(`  Cell is unknown, register first`);
    }

    socket.on('disconnect', () => {
        if (cell != null) {
            console.log(`Cell disconnected - ${cell.deviceName} [${uuid}]`);
            delete cell.onchange;
        } else {
            console.log(`Cell disconnected - <unknown> [${uuid}]`);
        }
        wall.connectedCells.delete(uuid);
    });
};
connectCell.schema = {
    query: {
        uuid: Joi.string().guid(),
    },
};
