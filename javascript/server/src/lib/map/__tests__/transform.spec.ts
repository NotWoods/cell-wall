import { describe, expect, it } from 'vitest';
import { transformMap, transformMapAsync } from '../transform';

describe.concurrent('transformMap', () => {
	it('transforms values', async () => {
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

describe.concurrent('transformMapAsync', () => {
	it('transforms values', async () => {
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
