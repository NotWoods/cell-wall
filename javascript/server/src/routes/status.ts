import { checkIfOn } from '@cell-wall/android-bridge';
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

export const statusPower: RouteOptions = {
  method: 'GET',
  url: '/v3/status/power/:udid',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          on: { type: 'boolean' },
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
      udid: string;
    }

    const device = this.deviceManager.devices.get(
      (request.params as Params).udid,
    );

    if (device) {
      const on = await checkIfOn(device);
      reply.status(200).send({
        on,
      });
    } else {
      reply.status(404).send({
        error: 'Could not find device',
      });
    }
  },
};
