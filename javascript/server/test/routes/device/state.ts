import test from 'ava';
import fastify from 'fastify';
import { registerRoutes } from '../../../src/routes/register';
import { statusState } from '../../../src/routes/device/state';

test('GET /v3/device/state 200', async (t) => {
  const app = fastify();
  registerRoutes(app, [statusState]);
  app.decorate('cells', {
    values: [
      {
        serial: 'ABC',
        info: { deviceName: 'Phone' },
        state: { type: 'BLANK' },
      },
    ],
  });

  const response = await app.inject({
    method: 'GET',
    url: '/v3/device/state',
  });

  t.is(response.statusCode, 200);
  t.deepEqual(response.json(), {
    cells: {
      ABC: {
        serial: 'ABC',
        info: { deviceName: 'Phone' },
        state: { type: 'BLANK' },
      },
    },
  });
});

test('GET /v3/device/state/:serial 200', async (t) => {
  const app = fastify();
  registerRoutes(app, [statusState]);
  app.decorate('cells', {
    values: [
      {
        serial: 'ABC',
        info: { deviceName: 'Phone' },
        state: { type: 'BLANK' },
      },
      {
        serial: 'EBF',
        info: { deviceName: 'Phone' },
        state: { type: 'BLANK' },
      },
    ],
  });

  const response = await app.inject({
    method: 'GET',
    url: '/v3/device/state/ABC',
  });

  t.is(response.statusCode, 200);
  t.deepEqual(response.json(), {
    cells: {
      ABC: {
        serial: 'ABC',
        info: { deviceName: 'Phone' },
        state: { type: 'BLANK' },
      },
    },
  });
});
