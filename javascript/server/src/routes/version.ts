import { RouteOptions } from './register';

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
    const { version } = require('../../package.json');
    return reply.send({ version });
  },
};
