import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import formbodyPlugin from 'fastify-formbody';
import staticPlugin from 'fastify-static';
import websocketPlugin from 'fastify-websocket';
import { resolve } from 'path';
import decorateServer from './decorate';
import * as routes from './routes';
import { registerRoutes } from './routes/register';

export default async function server(
  app: FastifyInstance,
  _options: FastifyServerOptions,
) {
  app.register(formbodyPlugin);
  app.register(staticPlugin, {
    root: resolve(__dirname, '../assets'),
    prefix: '/assets/',
  });
  app.register(websocketPlugin);
  await decorateServer(app);

  registerRoutes(app, Object.values(routes));

  return app;
}

export const options: FastifyServerOptions = {
  logger: {
    level: 'info',
  },
  caseSensitive: false,
  ignoreTrailingSlash: true,
  trustProxy: true,
};
