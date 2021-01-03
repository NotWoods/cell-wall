import test from 'ava';
import fastify from 'fastify';
import { createRequire } from 'module';
import { cellWallVersion } from '../../src/routes/version.js';

const require = createRequire(import.meta.url);
const pkg: { version: string } = require('../../package.json');

test('/v3/cellwall-version', async (t) => {
  const app = fastify();
  app.route(cellWallVersion);

  const response = await app.inject({
    method: 'GET',
    url: '/v3/cellwall-version',
  });

  t.deepEqual(response.json(), {
    version: pkg.version,
  });
  t.is(response.statusCode, 200);
});
