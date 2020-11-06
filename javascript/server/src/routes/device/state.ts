import { CellData, CellState } from '@cell-wall/cells';
import * as premadeStates from '../../static';
import { ErrorReply, errorSchema, SerialParams } from '../helpers';
import { MultiRouteOptions, RouteOptions } from '../register';

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

export const statusState: MultiRouteOptions<{
  Params: SerialParams;
  Reply: ErrorReply | { devices: Record<string, CellData> };
}> = {
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
    const { serial } = request.params;

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

export const actionState: RouteOptions<{
  Params: Required<SerialParams>;
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

    this.cells.setState(serial, state);
    reply.status(200).send({
      devices: [serial],
    });
  },
};

export const actionStateAll: RouteOptions<{
  Querystring: StaticQuery;
  Body: Record<string, CellState>;
  Reply: ErrorReply | { devices: string[] };
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
    let deviceStates = request.body;
    const { premade } = request.query;
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
