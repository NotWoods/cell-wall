import test from 'ava';
import fastify from 'fastify';
import { statusPower } from '../../src/routes/status';

test('/v3/status/power 200', async (t) => {
  const app = fastify();
  app.route(statusPower);
  app.decorate('deviceManager', {
    devices: new Map([['ABC', { shell: () => 'mWakefulness=Awake' }]]),
  });

  const response = await app.inject({
    method: 'GET',
    url: '/v3/status/power/ABC',
  });

  t.is(response.statusCode, 200);
  t.deepEqual(response.json(), {
    on: true,
  });
});

test('/v3/status/power 404', async (t) => {
  const app = fastify();
  app.route(statusPower);
  app.decorate('deviceManager', {
    devices: new Map(),
  });

  const response = await app.inject({
    method: 'GET',
    url: '/v3/status/power/ABC',
  });

  t.is(response.statusCode, 404);
  t.deepEqual(response.json(), {
    error: 'Could not find device',
  });
});
