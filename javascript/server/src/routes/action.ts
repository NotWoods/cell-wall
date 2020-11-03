import { setPower } from '@cell-wall/android-bridge';
import { CellState } from '@cell-wall/cells';
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

export const actionPower: RouteOptions = {
  method: 'POST',
  url: '/v3/action/power',
  schema: {
    body: {
      type: 'object',
      properties: {
        on: { type: 'boolean' },
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

export const actionState: RouteOptions = {
  method: 'POST',
  url: '/v3/action/state/:serial',
  async handler(request, reply) {
    interface Params {
      serial: string;
    }

    const { serial } = request.params as Params;
    const cells = this.cells;
    const state = request.body as CellState;

    try {
      cells.setState(serial, state);
      reply.status(200).send({ serial, state });
    } catch (err) {
      reply.status(404).send({ error: err.message });
    }
  },
};
