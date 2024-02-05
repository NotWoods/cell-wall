import type { CellInfo } from '@cell-wall/shared';
import { describe, it, expect } from 'vitest';
import { distributeText } from '../distribute';

const demoDevices: ReadonlyMap<string, CellInfo | undefined> = new Map<
	string,
	CellInfo | undefined
>()
	.set('demo1', {
		serial: 'demo1',
		x: 0,
		y: 0,
		width: 315,
		height: 455
	})
	.set('demo2', {
		serial: 'demo2',
		x: 332,
		y: 0,
		width: 629,
		height: 219
	})
	.set('demo3', {
		serial: 'demo3',
		x: 332,
		y: 236,
		width: 629,
		height: 219
	})
	.set('demo4', {
		serial: 'demo4',
		x: 0,
		y: 472,
		width: 960,
		height: 329
	});

describe('distributeText', () => {
	it('distributes text among demo cells', () => {
		expect(
			distributeText(demoDevices, [
				'Aged Pu-erh',
				'Mana Assam',
				'Darjeeling',
				'Lapsang Souchong',
				'White Fairy',
				'Kashi Ginger',
				'Elderberry Hibiscus',
				'Genmaicha',
				'Jasmine'
			])
		).toEqual(
			new Map<string, string[]>()
				.set('demo1', ['Aged Pu-erh', 'Mana Assam'])
				.set('demo2', ['Darjeeling', 'Lapsang Souchong'])
				.set('demo3', ['White Fairy', 'Kashi Ginger'])
				.set('demo4', ['Elderberry Hibiscus', 'Genmaicha', 'Jasmine'])
		);
	});
});
