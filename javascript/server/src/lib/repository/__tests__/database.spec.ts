import { describe, it, expect } from '@jest/globals';
import { database } from '../database';

describe('database', () => {
	it('gets and sets google credentials', async () => {
		const db = await database();

		expect(await db.getGoogleCredentials()).toBeUndefined();

		await db.setGoogleCredentials({ access_token: 'ABC' });

		expect(await db.getGoogleCredentials()).toEqual({ access_token: 'ABC' });
	});
});
