import test from 'ava';
import { repository } from '../src/repository.js';

test('insert and get tokens', async (t) => {
  const repo = await repository(':memory:');

  t.is(undefined, await repo.getTokens());

  await repo.insertTokens({ access_token: 'ABC' });
  t.deepEqual({ access_token: 'ABC' }, await repo.getTokens());
});
