import test from 'ava';
import { transformMapAsync } from '../src/async-map';

test('transformMapAsync', async (t) => {
  const input = new Map(
    Object.entries({
      foo: 'bar',
      bar: 'foo',
    }),
  );

  const output = await transformMapAsync(input, async (val) =>
    val.toUpperCase(),
  );

  t.deepEqual(
    {
      foo: 'BAR',
      bar: 'FOO',
    },
    Object.fromEntries(output),
  );
});
