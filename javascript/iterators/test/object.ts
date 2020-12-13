import test from 'ava';
import { entries } from '../src/object.js';

test('transformMap', async (t) => {
  const obj = {
    foo: 'bar',
    bar: 'foo',
  };
  const map = new Map(Object.entries(obj));

  const expected: [string, string][] = [
    ['foo', 'bar'],
    ['bar', 'foo'],
  ];
  t.deepEqual(Array.from(entries(obj)), expected);
  t.deepEqual(Array.from(entries(map)), expected);
});
