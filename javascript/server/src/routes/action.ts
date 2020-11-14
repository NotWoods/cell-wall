import { transformMapAsync } from '@cell-wall/iterators';
import type { InstallOrUpgradeResult } from 'appium-adb';
import { filterDevices, SerialParams } from './helpers';
import { MultiRouteOptions, RouteOptions } from './register';

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

export const actioninstallAll: MultiRouteOptions<{
  Body: { path: string };
  Params: SerialParams;
  Reply: { devices: Record<string, InstallOrUpgradeResult> };
}> = {
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
    const { serial } = request.params;
    const { path = '/home/pi/cell-wall-deploy/app-debug.apk' } = request.body;

    const devices = filterDevices(this.deviceManager, reply, serial);
    if (!devices) return;

    reply.status(200).send({
      devices: Object.fromEntries(
        await transformMapAsync(devices, (device) =>
          device.installOrUpgrade(path, 'com.tigeroakes.cellwall.client', {
            allowTestPackages: true,
            enforceCurrentBuild: true,
          }),
        ),
      ),
    });
  },
};
