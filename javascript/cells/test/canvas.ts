import test from 'ava';
import { cellCanvas, shiftCell } from '../src/canvas.js';

const pixel = {
  serial: 'ABC',
  info: {
    deviceName: 'Pixel_3a',
    width: 392,
    height: 791,
    x: 0,
    y: 0,
  },
};

const polaroid = {
  serial: 'B0123',
  info: {
    deviceName: 'Polaroid A600',
    server: 'http://127.0.0.1:3000/',
    width: 470,
    height: 835,
    x: 2315,
    y: 1385,
  },
};

test('cellCanvas', async (t) => {
  const canvas1 = cellCanvas([pixel]);
  t.deepEqual(canvas1, { x: 0, y: 0, width: 392, height: 791 });

  const canvas2 = cellCanvas([pixel, polaroid]);
  t.deepEqual(canvas2, { x: 0, y: 0, width: 2785, height: 2220 });

  const canvas3 = cellCanvas([polaroid]);
  t.deepEqual(canvas3, { x: 2315, y: 1385, width: 470, height: 835 });
});

test('shiftCell', async (t) => {
  const canvas = cellCanvas([polaroid]);
  const shifted = shiftCell(canvas, polaroid.info);
  t.deepEqual(shifted, {
    deviceName: 'Polaroid A600',
    server: 'http://127.0.0.1:3000/',
    width: 470,
    height: 835,
    x: 0,
    y: 0,
  });
});
