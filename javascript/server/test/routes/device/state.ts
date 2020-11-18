import test from 'ava';
import fastify from 'fastify';
import { registerRoutes } from '../../../src/routes/register.js';
import {
  statusStateAll,
  statusState,
} from '../../../src/routes/device/state.js';

const cellsMock = new Map([
  [
    'ABC',
    {
      serial: 'ABC',
      info: { deviceName: 'Phone' },
      state: { type: 'BLANK' },
    },
  ],
  [
    'EBF',
    {
      serial: 'EBF',
      info: { deviceName: 'Phone' },
      state: { type: 'WEB', url: 'http://example.com' },
    },
  ],
]);

test('GET /v3/device/state 200', async (t) => {
  const app = fastify();
  registerRoutes(app, [statusStateAll]);
  app.decorate('cells', cellsMock);

  const response = await app.inject({
    method: 'GET',
    url: '/v3/device/state',
  });

  t.deepEqual(response.json(), {
    devices: {
      ABC: {
        type: 'BLANK',
      },
      EBF: {
        type: 'WEB',
        url: 'http://example.com',
      },
    },
  });
  t.is(response.statusCode, 200);
});

test('GET /v3/device/state/:serial 200', async (t) => {
  const app = fastify();
  registerRoutes(app, [statusState]);
  app.decorate('cells', cellsMock);

  const response = await app.inject({
    method: 'GET',
    url: '/v3/device/state/ABC',
  });

  t.deepEqual(response.json(), {
    devices: {
      ABC: {
        type: 'BLANK',
      },
    },
  });
  t.is(response.statusCode, 200);
});
