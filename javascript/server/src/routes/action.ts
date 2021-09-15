import { RouteOptions } from './register.js';

export const actionRefresh: RouteOptions<{
  Reply: { devices: string[] };
}> = {
  method: 'POST',
  url: '/v3/action/refresh',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          devices: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
  },
  async handler(_request, _reply) {
    const devices = await this.deviceManager.refreshDevices();
    return {
      devices: Array.from(devices.keys()),
    };
  },
};
