import test from 'ava';
import fastify from 'fastify';
import sensible from 'fastify-sensible';
import { registerRoutes } from '../../../src/routes/register.js';
import { actionPower, statusPower } from '../../../src/routes/device/power.js';

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

  t.deepEqual(response.json(), {
    devices: {
      ABC: {
        on: true,
      },
    },
  });
  t.is(response.statusCode, 200);
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

  t.deepEqual(response.json(), {
    devices: {
      ABC: {
        on: true,
      },
    },
  });
  t.is(response.statusCode, 200);
});

test('GET /v3/device/power/:serial 404', async (t) => {
  const app = fastify();
  registerRoutes(app, [statusPower]);
  await app.register(sensible);
  app.decorate('deviceManager', {
    devices: new Map(),
  });

  const response = await app.inject({
    method: 'GET',
    url: '/v3/device/power/ABC',
  });

  t.deepEqual(response.json(), {
    error: 'Not Found',
    message: 'Could not find device ABC',
    statusCode: 404,
  });
  t.is(response.statusCode, 404);
});

test('POST /v3/device/power on=true', async (t) => {
  let keyPressed: number | undefined;

  const app = fastify();
  registerRoutes(app, [actionPower]);
  app.decorate('deviceManager', {
    devices: new Map([
      [
        'ABC',
        {
          shell: () => '',
          keyevent(key: number) {
            keyPressed = key;
          },
        },
      ],
    ]),
  });

  const response = await app.inject({
    method: 'POST',
    url: '/v3/device/power',
    payload: { on: true },
  });

  t.deepEqual(response.json(), {
    devices: ['ABC'],
    on: true,
  });
  t.is(response.statusCode, 200);

  t.is(26, keyPressed);
});
