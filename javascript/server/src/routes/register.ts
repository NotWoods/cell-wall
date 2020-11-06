import { CellInfo } from '@cell-wall/cells';
import { RouteOptions } from 'fastify';
import { errorSchema, MultiRouteOptions, SerialParams } from './helpers';

const cellInfoSchema = {
  type: 'object',
  properties: {
    deviceName: { type: 'string' },
    density: { type: 'number' },
    widthPixels: { type: 'number' },
    heightPixels: { type: 'number' },
    server: { type: 'string' },
  },
};

export const cellWallVersion: RouteOptions = {
  method: 'GET',
  url: '/v3/cellwall-version',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' },
        },
      },
    },
  },
  async handler(_request, reply) {
    const { version } = require('../../package.json');
    return reply.send({ version });
  },
};

export const getCells: MultiRouteOptions = {
  method: 'GET',
  url: ['/v3/device', '/v3/device/:serial'],
  schema: {
    response: {
      200: {
        type: 'object',
        additionalProperties: cellInfoSchema,
      },
      404: errorSchema,
    },
  },
  async handler(request, reply) {
    const { serial } = request.params as SerialParams;

    let cells = Array.from(this.cells.values());
    if (serial) {
      cells = cells.filter((cell) => cell.serial === serial);
      if (cells.length === 0) {
        reply.status(404).send({ error: `Could not find cell ${serial}` });
        return;
      }
    }

    const entries = cells.map((cell) => [cell.serial, cell.info] as const);
    reply.status(200).send(Object.fromEntries(entries));
  },
};

export const registerCell: RouteOptions = {
  method: 'PUT',
  url: '/v3/device/:serial',
  schema: {
    body: cellInfoSchema,
    response: {
      200: {
        type: 'object',
        properties: {
          socket: { type: 'string' },
        },
      },
      404: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
  async handler(request, reply) {
    const { serial } = request.params as Required<SerialParams>;
    const info = request.body as CellInfo;
    const devices = this.deviceManager.devices;

    if (devices.has(serial)) {
      this.cells.register(serial, info);
      reply.status(200).send({
        socket: `/v3/cell?serial=${serial}`,
      });
    } else {
      reply.status(404).send({
        error: `Could not find matching serial`,
      });
    }
  },
};
