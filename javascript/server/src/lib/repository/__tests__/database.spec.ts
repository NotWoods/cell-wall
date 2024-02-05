import { describe, it, expect } from 'vitest';
import { database } from '../database';

describe('database', () => {
	it('gets and sets google credentials', async () => {
		const db = database();
		let data = await db.get();

		expect(data.googleCredentials).toBeUndefined();

		await db.update((data) => ({ ...data, googleCredentials: { access_token: 'ABC' } }));

		data = await db.get();
		expect(data.googleCredentials).toEqual({ access_token: 'ABC' });
	});
});
