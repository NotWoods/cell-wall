import { DeviceManager } from '@cell-wall/android-bridge';
import {
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
} from 'fastify';

declare module 'fastify' {
  export interface FastifyInstance<
    RawServer extends RawServerBase,
    RawRequest extends RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer>,
    Logger
  > {
    deviceManager: DeviceManager;
  }
}

export default async function decorateServer(app: FastifyInstance) {
  const deviceManager = new DeviceManager();
  await deviceManager.refreshDevices();

  app.decorate('deviceManager', deviceManager);
}
