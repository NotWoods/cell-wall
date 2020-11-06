import { DeviceManager, DeviceMap } from '@cell-wall/android-bridge';
import { FastifyReply, RawServerDefault } from 'fastify';
import { RawRequestDefault, RawReplyDefault } from './register';

export interface SerialParams {
  serial?: string;
}

export interface ErrorReply {
  error: string;
}

export const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
};

export function filterDevices(
  deviceManager: DeviceManager,
  reply: FastifyReply<
    RawServerDefault,
    RawRequestDefault,
    RawReplyDefault,
    { Reply: ErrorReply | unknown }
  >,
  serial: string | undefined,
): DeviceMap | undefined {
  if (serial) {
    const device = deviceManager.devices.get(serial);
    if (device) {
      return new Map().set(serial, device);
    } else {
      reply.status(404).send({ error: `Could not find device ${serial}` });
      return undefined;
    }
  } else {
    return deviceManager.devices;
  }
}
