import { CellState } from '@cell-wall/cells';
import { RouteOptions } from 'fastify';
import * as premadeStates from '../../static';
import { errorSchema, MultiRouteOptions, SerialParams } from '../helpers';

interface StaticQuery {
  premade?: string;
}

const cellStateSchema = {
  type: 'object',
  properties: {
    type: { type: 'string' },
  },
  required: ['type'],
  additionalProperties: true,
};

export const statusState: MultiRouteOptions = {
  method: 'GET',
  url: ['/v3/device/state', '/v3/device/state/:serial'],
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
      404: errorSchema,
    },
  },
  async handler(request, reply) {
    const { serial } = request.params as SerialParams;

    let cells = new Map(
      Array.from(this.cells.values()).map(
        (cell) => [cell.serial, cell] as const,
      ),
    );

    if (serial) {
      const cell = cells.get(serial);
      if (cell) {
        cells = new Map().set(serial, cell);
      } else {
        reply.status(404).send({ error: `Could not find device ${serial}` });
        return;
      }
    }

    reply.status(200).send({
      devices: Object.fromEntries(cells),
    });
  },
};

export const actionState: RouteOptions = {
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
    const { serial } = request.params as Required<SerialParams>;
    const state = request.body as CellState;

    this.cells.setState(serial, state);
    reply.status(200).send({
      devices: [serial],
    });
  },
};

export const actionStateAll: RouteOptions = {
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
    let deviceStates = request.body as Record<string, CellState>;
    const { premade } = request.query as StaticQuery;
    if (premade) {
      const state = premadeStates[premade as keyof typeof premadeStates];
      if (state) {
        deviceStates = state as Record<string, CellState>;
      } else {
        reply.status(404).send({ error: `Invalid premade name ${premade}` });
        return;
      }
    }

    const devices: string[] = [];
    for (const [serial, state] of Object.entries(deviceStates)) {
      this.cells.setState(serial, state);
      devices.push(serial);
    }

    reply.status(200).send({ devices });
  },
};
