import { DeviceManager, DeviceMap } from '@cell-wall/android-bridge';
import { FastifyReply, RawServerDefault } from 'fastify';
import { RawRequestDefault, RawReplyDefault } from './register';

export interface SerialParams {
  serial?: string;
}

export function filterDevices(
  deviceManager: DeviceManager,
  reply: FastifyReply<
    RawServerDefault,
    RawRequestDefault,
    RawReplyDefault,
    { Reply: Error | unknown }
  >,
  serial: string | undefined,
): DeviceMap | undefined {
  if (serial) {
    const device = deviceManager.devices.get(serial);
    if (device) {
      return new Map().set(serial, device);
    } else {
      reply.notFound(`Could not find device ${serial}`);
      return undefined;
    }
  } else {
    return deviceManager.devices;
  }
}
