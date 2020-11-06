import { checkIfOn, setPower } from '@cell-wall/android-bridge';
import { transformMapAsync } from '@cell-wall/iterators';
import {
  ErrorReply,
  errorSchema,
  filterDevices,
  SerialParams,
} from '../helpers';
import { MultiRouteOptions } from '../register';

export const statusPower: MultiRouteOptions<{
  Params: SerialParams;
  Reply: ErrorReply | { devices: Record<string, { on: boolean }> };
}> = {
  method: 'GET',
  url: ['/v3/device/power', '/v3/device/power/:serial'],
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          devices: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                on: { type: 'boolean' },
              },
              required: ['on'],
            },
          },
        },
      },
      404: errorSchema,
    },
  },
  async handler(request, reply) {
    const { serial } = request.params;

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

export const actionPower: MultiRouteOptions<{
  Params: SerialParams;
  Body: { on: boolean | 'toggle' };
  Reply: ErrorReply | { devices: string[] };
}> = {
  method: 'POST',
  url: ['/v3/device/power', '/v3/device/power/:serial'],
  schema: {
    body: {
      type: 'object',
      properties: {
        on: {
          enum: ['toggle', true, false],
        },
      },
      required: ['on'],
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
      404: errorSchema,
    },
  },
  async handler(request, reply) {
    const { serial } = request.params;
    let { on } = request.body;

    const devices = filterDevices(this.deviceManager, reply, serial);
    if (!devices) return;

    await setPower(devices, on);
    reply.status(200).send({
      devices: Array.from(devices.keys()),
    });
  },
};
