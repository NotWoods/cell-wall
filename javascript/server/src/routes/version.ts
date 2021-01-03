import { version } from '../env.js';
import { RouteOptions } from './register.js';

export const cellWallVersion: RouteOptions<{
  Reply: { version: string };
}> = {
  method: 'GET',
  url: '/v3/cellwall-version',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' },
        },
      },
    },
  },
  async handler(_request, reply) {
    return reply.send({ version });
  },
};
