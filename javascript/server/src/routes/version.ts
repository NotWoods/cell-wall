import { readFile } from 'fs/promises';
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
    const json = await readFile('../../package.json', 'utf8');
    const { version } = JSON.parse(json);
    return reply.send({ version });
  },
};
