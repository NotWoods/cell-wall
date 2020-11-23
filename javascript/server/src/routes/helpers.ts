import { DeviceMap } from '@cell-wall/android-bridge';
import { FastifyInstance } from 'fastify';

export interface SerialParams {
  serial?: string;
}

export function filterDevices(
  app: FastifyInstance,
  serial: string | undefined,
): DeviceMap {
  if (serial) {
    const device = app.deviceManager.devices.get(serial);
    if (device) {
      return new Map().set(serial, device);
    } else {
      throw app.httpErrors.notFound(`Could not find device ${serial}`);
    }
  } else {
    return app.deviceManager.devices;
  }
}
