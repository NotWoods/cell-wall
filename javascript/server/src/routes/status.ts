import { checkIfOn } from '@cell-wall/android-bridge';
import { RouteOptions } from 'fastify';

export const statusPowerAll: RouteOptions = {
  method: 'GET',
  url: '/v3/status/power/',
  async handler(_request, _reply) {
    const devices = this.deviceManager.devices;

    return {
      devices: Object.fromEntries(
        await Promise.all(
          Array.from(devices.entries()).map(async ([udid, device]) => {
            return [udid, await checkIfOn(device)];
          }),
        ),
      ),
    };
  },
};

export const statusPower: RouteOptions = {
  method: 'GET',
  url: '/v3/status/power/:serial',
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
      serial: string;
    }

    const { serial } = request.params as Params;
    const device = this.deviceManager.devices.get(serial);

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

export const statusStateAll: RouteOptions = {
  method: 'GET',
  url: '/v3/status/state/',
  async handler(_request, _reply) {
    const cells = this.cells.values();

    return {
      devices: Object.fromEntries(
        Array.from(cells).map((cell) => [cell.serial, cell]),
      ),
    };
  },
};
