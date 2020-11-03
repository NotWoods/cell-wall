import { checkIfOn, setPower } from '@cell-wall/android-bridge';
import { transformMapAsync } from '@cell-wall/iterators';
import {
  errorSchema,
  filterDevices,
  MultiRouteOptions,
  SerialParams,
} from '../helpers';

interface Power {
  on: boolean;
}

const powerSchema = {
  type: 'object',
  properties: {
    on: { type: 'boolean' },
  },
  required: ['on'],
};

export const statusPower: MultiRouteOptions = {
  method: 'GET',
  url: ['/v3/device/power', '/v3/device/power/:serial'],
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          devices: {
            type: 'object',
            additionalProperties: powerSchema,
          },
        },
      },
      404: errorSchema,
    },
  },
  async handler(request, reply) {
    const { serial } = request.params as SerialParams;

    const devices = filterDevices(this.deviceManager, reply, serial);
    if (!devices) return;

    reply.status(200).send({
      devices: Object.fromEntries(
        await transformMapAsync(devices, async (device) => ({
          on: await checkIfOn(device),
        })),
      ),
    });
  },
};

export const actionPower: MultiRouteOptions = {
  method: 'POST',
  url: ['/v3/device/power', '/v3/device/power/:serial'],
  schema: {
    body: powerSchema,
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
      404: errorSchema,
    },
  },
  async handler(request, reply) {
    const { serial } = request.params as SerialParams;
    const { on } = request.body as Power;

    const devices = filterDevices(this.deviceManager, reply, serial);
    if (!devices) return;

    await setPower(devices, on);
    reply.status(200).send({
      devices: Array.from(devices.keys()),
    });
  },
};
