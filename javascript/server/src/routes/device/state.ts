import { cellStateSchema, CellState } from '@cell-wall/cells';
import { transformMap } from '@cell-wall/iterators';
import { updateRest, SerialParams, RestQuery } from '../helpers.js';
import { RouteOptions } from '../register.js';

export const statusState: RouteOptions<{
  Params: Required<SerialParams>;
  Reply: { devices: Record<string, CellState> };
}> = {
  method: 'GET',
  url: '/v3/device/state/:serial',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          devices: {
            type: 'object',
            additionalProperties: cellStateSchema,
          },
        },
      },
    },
  },
  async handler(request, reply) {
    const { serial } = request.params;

    const cell = this.cells.get(serial);
    if (cell) {
      reply.status(200).send({
        devices: {
          [serial]: cell.state,
        },
      });
    } else {
      reply.notFound(`Could not find device ${serial}`);
    }
  },
};

export const statusStateAll: RouteOptions<{
  Reply: { devices: Record<string, CellState> };
}> = {
  method: 'GET',
  url: '/v3/device/state',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          devices: {
            type: 'object',
            additionalProperties: cellStateSchema,
          },
        },
      },
    },
  },
  async handler(_request, reply) {
    const cells = transformMap(this.cells, (cell) => cell.state);

    reply.status(200).send({
      devices: Object.fromEntries(cells),
    });
  },
};

export const actionState: RouteOptions<{
  Params: SerialParams;
  Body: CellState;
  Reply: { devices: string[] };
}> = {
  method: 'POST',
  url: '/v3/device/state/:serial',
  schema: {
    body: cellStateSchema,
    response: {
      200: {
        type: 'object',
        properties: {
          devices: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  async handler(request, reply) {
    const { serial } = request.params;
    const state = request.body;

    if (serial) {
      this.cells.setState(serial, state);
      reply.status(200).send({
        devices: [serial],
      });
    } else {
      const { updated } = this.cells.setStateAll(this.cells.keys(), state);
      reply.status(200).send({
        devices: Array.from(updated),
      });
    }
  },
};

export const actionStateAll: RouteOptions<{
  Body: Record<string, CellState>;
  Querystring: RestQuery;
  Reply: { devices: string[] };
}> = {
  method: 'POST',
  url: '/v3/device/state',
  schema: {
    body: {
      type: 'object',
      properties: {
        devices: {
          type: 'object',
          additionalProperties: cellStateSchema,
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          devices: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  async handler(request, reply) {
    const deviceStates = request.body;
    const { rest } = request.query;

    const modified = this.cells.setStateMap(deviceStates);
    await updateRest(this, modified.rest, rest);

    reply.status(200).send({ devices: Array.from(modified.updated) });
  },
};
