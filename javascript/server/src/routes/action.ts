import { transformMapAsync } from '@cell-wall/iterators';
import { RouteOptions } from 'fastify';
import { filterDevices, MultiRouteOptions, SerialParams } from './helpers';

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

export const actioninstallAll: MultiRouteOptions = {
  method: 'POST',
  url: ['/v3/action/install', '/v3/action/install/:serial'],
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
  async handler(request, reply) {
    interface Body {
      path: string;
    }

    const { serial } = request.params as SerialParams;
    const {
      path = '/home/pi/cell-wall-deploy/app-debug.apk',
    } = request.body as Body;

    const devices = filterDevices(this.deviceManager, reply, serial);
    if (!devices) return;

    reply.status(200).send({
      devices: Object.fromEntries(
        await transformMapAsync(devices, (device) =>
          device.installOrUpgrade(path, 'com.tigeroakes.cellwallclient', {
            allowTestPackages: true,
            enforceCurrentBuild: true,
          }),
        ),
      ),
    });
  },
};
