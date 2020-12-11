import { CellInfo } from '@cell-wall/cells';
import test from 'ava';
import Jimp from 'jimp';
import { CropProps } from '../src/manipulate.js';
import { splitImage } from '../src/split.js';

const cellInfo = {
  '93HAY0BJ0G': {
    width: 392,
    height: 791,
    x: 0,
    y: 0,
  },
  '4e50f5bd': {
    width: 470,
    height: 835,
    x: 1845,
    y: 135,
  },
  D01EC0A0201512ER: {
    width: 1024,
    height: 552,
    x: 145,
    y: 1575,
  },
  TA880004ZI: {
    width: 598,
    height: 360,
    x: 865,
    y: 240,
  },
  TA880007GH: {
    width: 598,
    height: 360,
    x: 865,
    y: 840,
  },
  '0123456789ABCDEF': {
    width: 470,
    height: 835,
    x: 2315,
    y: 1385,
  },
};

test('splitImage all', async (t) => {
  const map = new Map(Object.entries(cellInfo)) as Map<string, CellInfo>;

  const image = await Jimp.create('../../images/finished.jpg');
  const splits = await splitImage(image, map);

  t.deepEqual(Array.from(splits.keys()), [
    '93HAY0BJ0G',
    '4e50f5bd',
    'D01EC0A0201512ER',
    'TA880004ZI',
    'TA880007GH',
    '0123456789ABCDEF',
  ]);
});

test('splitImage partial', async (t) => {
  const map = new Map<string, Pick<CellInfo, CropProps>>()
    .set('TA880004ZI', cellInfo.TA880004ZI)
    .set('TA880007GH', cellInfo.TA880007GH);

  const image = await Jimp.create('../../images/finished.jpg');
  const splits = await splitImage(image, map);

  t.deepEqual(splits.get('TA880004ZI')?.info, {
    height: 360,
    width: 598,
    x: 0,
    y: 0,
  });
  t.deepEqual(splits.get('TA880007GH')?.info, {
    height: 360,
    width: 598,
    x: 0,
    y: 600,
  });
});
