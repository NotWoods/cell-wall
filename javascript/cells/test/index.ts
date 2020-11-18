import test from 'ava';
import { CellManager } from '../src/index.js';

test('cellManager.canvas', async (t) => {
  const cells = new CellManager('');
  cells.register('ABC', {
    deviceName: 'Pixel_3a',
    width: 392,
    height: 791,
    x: 0,
    y: 0,
  });
  t.deepEqual(cells.canvas, { width: 392, height: 791 });

  cells.register('DEF', {
    deviceName: 'Polaroid A600',
    server: 'http://127.0.0.1:3000/',
    width: 470,
    height: 835,
    x: 2315,
    y: 1385,
  });
  t.deepEqual(cells.canvas, { width: 2785, height: 2220 });
});
