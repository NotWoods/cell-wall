import { resolve } from 'path';
import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import formbodyPlugin from 'fastify-formbody';
import staticPlugin from 'fastify-static';
import decorateServer from './decorate';
import * as routes from './routes';
import { registerRoutes } from './routes/helpers';

export default async function server(
  app: FastifyInstance,
  _options: FastifyServerOptions,
) {
  app.register(formbodyPlugin);
  app.register(staticPlugin, {
    root: resolve(__dirname, '../assets'),
    prefix: '/assets/',
  });
  await decorateServer(app);

  registerRoutes(app, Object.values(routes));

  return app;
}
