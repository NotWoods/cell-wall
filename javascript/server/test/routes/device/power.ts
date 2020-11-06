import test from 'ava';
import fastify from 'fastify';
import { registerRoutes } from '../../../src/routes/register';
import { statusPower } from '../../../src/routes/device/power';

test('GET /v3/device/power 200', async (t) => {
  const app = fastify();
  registerRoutes(app, [statusPower]);
  app.decorate('deviceManager', {
    devices: new Map([['ABC', { shell: () => 'mWakefulness=Awake' }]]),
  });

  const response = await app.inject({
    method: 'GET',
    url: '/v3/device/power',
  });

  t.is(response.statusCode, 200);
  t.deepEqual(response.json(), {
    devices: {
      ABC: {
        on: true,
      },
    },
  });
});

test('GET /v3/device/power/:serial 200', async (t) => {
  const app = fastify();
  registerRoutes(app, [statusPower]);
  app.decorate('deviceManager', {
    devices: new Map([['ABC', { shell: () => 'mWakefulness=Awake' }]]),
  });

  const response = await app.inject({
    method: 'GET',
    url: '/v3/device/power/ABC',
  });

  t.is(response.statusCode, 200);
  t.deepEqual(response.json(), {
    devices: {
      ABC: {
        on: true,
      },
    },
  });
});

test('GET /v3/device/power/:serial 404', async (t) => {
  const app = fastify();
  registerRoutes(app, [statusPower]);
  app.decorate('deviceManager', {
    devices: new Map(),
  });

  const response = await app.inject({
    method: 'GET',
    url: '/v3/device/power/ABC',
  });

  t.is(response.statusCode, 404);
  t.deepEqual(response.json(), {
    error: 'Could not find device ABC',
  });
});
