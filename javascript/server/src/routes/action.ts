import { setPower } from '@cell-wall/android-bridge';
import { RouteOptions } from 'fastify';

export const actionRefresh: RouteOptions = {
  method: 'POST',
  url: '/v3/action/refresh',
  async handler(_request, _reply) {
    const devices = await this.deviceManager.refreshDevices();
    return {
      devices: Array.from(devices.keys()),
    };
  },
};

export const actionPower: RouteOptions = {
  method: 'POST',
  url: '/v3/action/power',
  schema: {
    body: {
      type: 'object',
      properties: {
        on: { type: 'boolean' },
      },
    },
  },
  async handler(request, _reply) {
    interface Body {
      on: boolean;
    }

    const devices = this.deviceManager.devices;

    const on = (request.body as Body).on;

    await setPower(devices, on);

    return {
      devices: Array.from(devices.keys()),
    };
  },
};
