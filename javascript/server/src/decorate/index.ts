import { DeviceManager } from '@cell-wall/android-bridge';
import { CellManager } from '@cell-wall/cells';
import {
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
} from 'fastify';
import { cellBridge } from './cell-bridge';

declare module 'fastify' {
  export interface FastifyInstance<
    RawServer extends RawServerBase,
    RawRequest extends RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer>,
    Logger
  > {
    deviceManager: DeviceManager;
    cells: CellManager;
  }
}

export default async function decorateServer(app: FastifyInstance) {
  const deviceManager = new DeviceManager();
  const cells = new CellManager();
  await Promise.all([deviceManager.refreshDevices(), cells.loadData()]);
  cellBridge(deviceManager, cells);

  app.decorate('deviceManager', deviceManager);
  app.decorate('cells', cells);
}
