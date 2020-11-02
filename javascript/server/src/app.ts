import fastify, { FastifyServerOptions } from 'fastify';
import decorateServer from './decorate';
import * as routes from './routes';

export default function server(options?: FastifyServerOptions) {
  const app = fastify(options);

  decorateServer(app);

  Object.values(routes).forEach((route) => app.route(route));

  return app;
}
