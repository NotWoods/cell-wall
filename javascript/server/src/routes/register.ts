import { CellInfo } from '@cell-wall/cells';
import { RouteOptions } from 'fastify';

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

export const registerCell: RouteOptions = {
  method: 'PUT',
  url: '/v3/device/:serial',
  schema: {
    body: {
      type: 'object',
      properties: {
        deviceName: { type: 'string' },
        density: { type: 'number' },
        widthPixels: { type: 'number' },
        heightPixels: { type: 'number' },
      },
    },
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
    interface Params {
      serial: string;
    }

    const { serial } = request.params as Params;
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
