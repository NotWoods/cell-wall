import { transformMapAsync } from '@cell-wall/iterators';
import type { AppInfo, InstallOrUpgradeResult } from 'appium-adb';
import { PACKAGE_NAME } from '../../decorate/cell-bridge';
import { filterDevices, SerialParams } from '../helpers';
import { MultiRouteOptions } from '../register';

export const stateInstallAll: MultiRouteOptions<{
  Params: SerialParams;
  Reply: { devices: Record<string, AppInfo> };
}> = {
  method: 'GET',
  url: ['/v3/device/install', '/v3/device/install/:serial'],
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          device: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                versionCode: { type: 'number' },
                versionName: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  async handler(request, reply) {
    const { serial } = request.params;

    const devices = filterDevices(this, serial);

    reply.status(200).send({
      devices: Object.fromEntries(
        await transformMapAsync(devices, (device) =>
          device.getPackageInfo(PACKAGE_NAME),
        ),
      ),
    });
  },
};

export const actionInstallAll: MultiRouteOptions<{
  Body: { path: string };
  Params: SerialParams;
  Reply: { devices: Record<string, InstallOrUpgradeResult> };
}> = {
  method: 'POST',
  url: ['/v3/device/install', '/v3/device/install/:serial'],
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

    const devices = filterDevices(this, serial);

    reply.status(200).send({
      devices: Object.fromEntries(
        await transformMapAsync(devices, (device) =>
          device.installOrUpgrade(path, PACKAGE_NAME, {
            allowTestPackages: true,
            enforceCurrentBuild: true,
          }),
        ),
      ),
    });
  },
};
