import test from 'ava';
import fastify from 'fastify';
import { cellWallVersion } from '../../src/routes/version';

test('/v3/cellwall-version', async (t) => {
  const app = fastify();
  app.route(cellWallVersion);

  const response = await app.inject({
    method: 'GET',
    url: '/v3/cellwall-version',
  });

  t.is(response.statusCode, 200);
  t.deepEqual(response.json(), {
    version: '3.0.0',
  });
});
