import type { CellInfo } from '@cell-wall/shared';
import { describe, it, expect } from '@jest/globals';
import { sortDevicesByPosition } from '../sort';

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

const homeCells: ReadonlyMap<string, CellInfo | undefined> = new Map<string, CellInfo | undefined>()
	.set('Amazon Kindle', {
		serial: 'D01EC0A0201512ER',
		server: 'http://192.168.1.114:3000',
		deviceName: 'Amazon Kindle',
		width: 1024,
		height: 552,
		x: 40,
		y: 900
	})
	.set('Moto G (no wifi)', {
		serial: 'TA880007GH',
		server: 'http://localhost:3000',
		deviceName: 'Moto G (no wifi)',
		width: 598,
		height: 360,
		x: 550,
		y: 500
	})
	.set('Moto G XT1034', {
		serial: 'TA880004ZI',
		server: 'http://192.168.1.114:3000',
		deviceName: 'Moto G XT1034',
		width: 598,
		height: 360,
		x: 500,
		y: 100
	})
	.set('OnePlus One', {
		serial: '4e50f5bd',
		server: 'http://192.168.1.114:3000',
		deviceName: 'OnePlus One',
		width: 470,
		height: 835,
		x: 1250,
		y: 10
	})
	.set('Sony G8342', {
		serial: 'BH9039X88Z',
		server: 'http://192.168.1.114:3000',
		deviceName: 'Sony G8342',
		width: 360,
		height: 640,
		x: 0,
		y: 0
	})
	.set('iOS', {
		serial: 'iOS',
		server: 'http://192.168.1.114:3000',
		deviceName: 'iPhone',
		width: 414,
		height: 606,
		x: 1100,
		y: 900
	});

describe('sortDevicesByPosition', () => {
	it('sort based on position on wall', () => {
		expect(sortDevicesByPosition(demoDevices)).toEqual(['demo1', 'demo2', 'demo3', 'demo4']);
	});

	it('sorts devices I use at home', () => {
		expect(sortDevicesByPosition(homeCells)).toEqual([
			'Sony G8342',
			'Moto G XT1034',
			'OnePlus One',
			'Moto G (no wifi)',
			'Amazon Kindle',
			'iOS'
		]);
	});
});
