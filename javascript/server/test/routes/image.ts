import test from 'ava';
import { readFile } from 'fs/promises';
import fastify from 'fastify';
import { CellManager } from '@cell-wall/cells';
import { imageParser } from '../../src/decorate/jimp.js';
import { registerRoutes } from '../../src/routes/register.js';
import {
  actionImage,
  actionGetLoadedImage,
  deleteImage,
} from '../../src/routes/image.js';

test('POST /v3/action/image', async (t) => {
  const cells = new CellManager('cell-info.json');
  await cells.loadData();

  const app = fastify();
  await imageParser(app, {});
  app.decorate('cells', cells);
  registerRoutes(app, [actionImage, actionGetLoadedImage, deleteImage]);

  await app.inject({
    method: 'DELETE',
    url: '/v3/action/image',
  });

  const response404 = await app.inject({
    method: 'GET',
    url: '/v3/action/image/93HAY0BJ0G',
  });
  t.is(response404.statusCode, 404);

  const response = await app.inject({
    method: 'POST',
    url: '/v3/action/image',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    payload: await readFile('../../images/finished.jpg'),
  });

  const json = response.json();
  t.deepEqual(Object.keys(json), [
    '93HAY0BJ0G',
    '4e50f5bd',
    'D01EC0A0201512ER',
    'TA880004ZI',
    'TA880007GH',
    '0123456789ABCDEF',
  ]);
  t.is(response.statusCode, 200);

  const response200 = await app.inject({
    method: 'GET',
    url: '/v3/action/image/93HAY0BJ0G',
  });
  t.is(response200.statusCode, 200);
  t.like(response200.headers, {
    'content-type': 'image/jpeg',
  });
});

test('POST /v3/action/image?device', async (t) => {
  const cells = new CellManager('cell-info.json');
  await cells.loadData();

  const app = fastify();
  await imageParser(app, {});
  app.decorate('cells', cells);
  registerRoutes(app, [actionImage, actionGetLoadedImage, deleteImage]);

  await app.inject({
    method: 'DELETE',
    url: '/v3/action/image',
  });

  const response = await app.inject({
    method: 'POST',
    url: '/v3/action/image?device=TA880004ZI&device=TA880007GH',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    payload: await readFile('../../images/finished.jpg'),
  });

  t.deepEqual(response.json(), {
    TA880004ZI: {
      src: '/v3/action/image/TA880004ZI',
      height: 360,
      width: 598,
      x: 0,
      y: 0,
    },
    TA880007GH: {
      src: '/v3/action/image/TA880007GH',
      height: 360,
      width: 598,
      x: 0,
      y: 600,
    },
  });
  t.is(response.statusCode, 200);
});
