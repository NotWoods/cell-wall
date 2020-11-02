import fastify, { FastifyServerOptions } from 'fastify';
import SocketIO from 'socket.io';
import decorateServer from './decorate';
import * as routes from './routes';

export default function server(options?: FastifyServerOptions) {
  const app = fastify(options);

  decorateServer(app);

  Object.values(routes).forEach((route) => app.route(route));

  const io = SocketIO(app.server);

  return { app, io };
}
