import { RouteOptions } from 'fastify';

export const actionRefresh: RouteOptions = {
  method: 'POST',
  url: '/v3/action/refresh',
  schema: {
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
  async handler(_request, _reply) {
    const devices = await this.deviceManager.refreshDevices();
    return {
      devices: Array.from(devices.keys()),
    };
  },
};

export const actioninstallAll: RouteOptions = {
  method: 'POST',
  url: '/v3/action/install',
  schema: {
    body: {
      type: 'object',
      properties: {
        path: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          device: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                wasUninstalled: { type: 'boolean' },
                appState: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  async handler(request, _reply) {
    interface Body {
      path: string;
    }

    const {
      path = '/home/pi/cell-wall-deploy/app-debug.apk',
    } = request.body as Body;
    const devices = this.deviceManager.devices;

    return {
      devices: Object.fromEntries(
        await Promise.all(
          Array.from(devices.entries()).map(async ([serial, device]) => {
            const result = await device.installOrUpgrade(
              path,
              'com.tigeroakes.cellwallclient',
              {
                allowTestPackages: true,
                enforceCurrentBuild: true,
              },
            );
            return [serial, result] as const;
          }),
        ),
      ),
    };
  },
};
