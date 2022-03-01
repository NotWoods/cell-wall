import { describe, expect, it } from '@jest/globals';
import Jimp from 'jimp';
import type { RectangleWithPosition } from '../rect';
import { splitImage } from '../split';

const cellInfo = {
	'93HAY0BJ0G': {
		width: 392,
		height: 791,
		x: 0,
		y: 0
	},
	'4e50f5bd': {
		width: 470,
		height: 835,
		x: 1845,
		y: 135
	},
	D01EC0A0201512ER: {
		width: 1024,
		height: 552,
		x: 145,
		y: 1575
	},
	TA880004ZI: {
		width: 598,
		height: 360,
		x: 865,
		y: 240
	},
	TA880007GH: {
		width: 598,
		height: 360,
		x: 865,
		y: 840
	},
	'0123456789ABCDEF': {
		width: 470,
		height: 835,
		x: 2315,
		y: 1385
	}
};

describe('splitImage', () => {
	it.skip('all', async () => {
		const map = new Map<string, RectangleWithPosition>(Object.entries(cellInfo));

		const image = await Jimp.create('../images/finished.jpg');
		const splits = await splitImage(image, map);

		expect(Array.from(splits.keys())).toEqual([
			'93HAY0BJ0G',
			'4e50f5bd',
			'D01EC0A0201512ER',
			'TA880004ZI',
			'TA880007GH',
			'0123456789ABCDEF'
		]);
	});

	it.skip('partial', async () => {
		const map = new Map<string, RectangleWithPosition>()
			.set('TA880004ZI', cellInfo.TA880004ZI)
			.set('TA880007GH', cellInfo.TA880007GH);

		const image = await Jimp.create('../images/finished.jpg');
		const splits = await splitImage(image, map);

		expect(splits.get('TA880004ZI')?.info).toEqual({
			height: 360,
			width: 598,
			x: 0,
			y: 0
		});
		expect(splits.get('TA880007GH')?.info).toEqual({
			height: 360,
			width: 598,
			x: 0,
			y: 600
		});
	});
});
