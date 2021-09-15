import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import formbodyPlugin from 'fastify-formbody';
import staticPlugin from 'fastify-static';
import { fileURLToPath } from 'url';
import decorateServer from './decorate/index.js';
import * as routes from './routes/index.js';
import { registerRoutes } from './routes/register.js';

export default async function server(
  app: FastifyInstance,
  _options: FastifyServerOptions,
) {
  app.register(formbodyPlugin);
  app.register(staticPlugin, {
    root: fileURLToPath(new URL('../assets', import.meta.url)),
    prefix: '/assets/',
  });
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
