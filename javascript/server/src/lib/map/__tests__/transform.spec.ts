import { describe, expect, it } from '@jest/globals';
import { transformMap, transformMapAsync } from '../transform';

describe('transformMapAsync', () => {
	it('', async () => {
		const input = new Map(
			Object.entries({
				foo: 'bar',
				bar: 'foo'
			})
		);

		const output = transformMap(input, (val) => val.toUpperCase());

		expect(Object.fromEntries(output)).toEqual({
			foo: 'BAR',
			bar: 'FOO'
		});
	});
});

describe('transformMapAsync', () => {
	it('', async () => {
		const input = new Map(
			Object.entries({
				foo: 'bar',
				bar: 'foo'
			})
		);

		const output = await transformMapAsync(input, async (val) => val.toUpperCase());

		expect(Object.fromEntries(output)).toEqual({
			foo: 'BAR',
			bar: 'FOO'
		});
	});
});
