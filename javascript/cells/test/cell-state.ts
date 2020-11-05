import test from 'ava';
import { CellStateType, toUri } from '../src/cell-state';

test('toUri WEB', async (t) => {
  t.is(
    toUri(
      { type: CellStateType.WEB, url: '/page/text' },
      'http://raspberrypi.local:3000/',
    ),
    'http://raspberrypi.local:3000/page/text',
  );
  t.is(
    toUri(
      { type: CellStateType.WEB, url: '/page/text' },
      'http://raspberrypi.local:3000/',
    ),
    'http://raspberrypi.local:3000/page/text',
  );
});
