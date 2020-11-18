import { DeviceManager } from '@cell-wall/android-bridge';
import { CellManager } from '@cell-wall/cells';
import { repository } from '@cell-wall/storage';
import {
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
} from 'fastify';
import sensible from 'fastify-sensible';
import { cellBridge } from './cell-bridge';
import { googleAuth, OAuth2Client } from './google-auth';
import { imageParser } from './jimp';

declare module 'fastify' {
  export interface FastifyInstance<
    RawServer extends RawServerBase,
    RawRequest extends RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer>,
    Logger
  > {
    deviceManager: DeviceManager;
    cells: CellManager;
    googleAuth: OAuth2Client;
  }
}

export default async function decorateServer(app: FastifyInstance) {
  const repo = await repository('.database.db');
  const deviceManager = new DeviceManager();
  const cells = new CellManager(process.env.CELLS_PATH || 'cell-info.json');
  const auth = await googleAuth(app, repo);
  await Promise.all([deviceManager.refreshDevices(), cells.loadData()]);
  cellBridge(deviceManager, cells);

  app.decorate('deviceManager', deviceManager);
  app.decorate('cells', cells);
  app.decorate('googleAuth', auth);
  await app.register(imageParser);
  await app.register(sensible);
}
