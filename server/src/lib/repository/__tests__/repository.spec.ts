import { describe, it, jest, expect } from '@jest/globals';
import { repository } from '../repository';

jest.mock('../../env');

describe('repository', () => {
	it('inserts and gets tokens', async () => {
		const repo = repository();

		expect(await repo.getTokens()).toBeUndefined();

		await repo.insertTokens({ access_token: 'ABC' });
		expect(await repo.getTokens()).toEqual({ access_token: 'ABC' });
	});
});
