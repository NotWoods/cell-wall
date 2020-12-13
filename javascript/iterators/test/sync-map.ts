import test from 'ava';
import { transformMap } from '../src/sync-map.js';

test('transformMap', async (t) => {
  const input = new Map(
    Object.entries({
      foo: 'bar',
      bar: 'foo',
    }),
  );

  const output = transformMap(input, (val) => val.toUpperCase());

  t.deepEqual(
    {
      foo: 'BAR',
      bar: 'FOO',
    },
    Object.fromEntries(output),
  );
});
