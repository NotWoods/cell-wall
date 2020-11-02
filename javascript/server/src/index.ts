import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import formbodyPlugin from 'fastify-formbody';
import SocketIO from 'socket.io';
import decorateServer from './decorate';
import * as routes from './routes';

export default async function server(
  app: FastifyInstance,
  _options: FastifyServerOptions,
) {
  app.register(formbodyPlugin);
  await decorateServer(app);

  Object.values(routes).forEach((route) => app.route(route));

  const io = SocketIO(app.server);

  return { app, io };
}
