import { describe, expect, it } from '@jest/globals';
import { cellCanvas, shiftCell } from '../canvas';

const pixel = {
	serial: 'ABC',
	info: {
		deviceName: 'Pixel_3a',
		width: 392,
		height: 791,
		x: 0,
		y: 0
	}
};

const polaroid = {
	serial: 'B0123',
	info: {
		deviceName: 'Polaroid A600',
		server: 'http://127.0.0.1:3000/',
		width: 470,
		height: 835,
		x: 2315,
		y: 1385
	}
};

describe('cellCanvas', () => {
	it('', async () => {
		const canvas1 = cellCanvas([pixel.info]);
		expect(canvas1).toEqual({ x: 0, y: 0, width: 392, height: 791 });

		const canvas2 = cellCanvas([pixel.info, polaroid.info]);
		expect(canvas2).toEqual({ x: 0, y: 0, width: 2785, height: 2220 });

		const canvas3 = cellCanvas([polaroid.info]);
		expect(canvas3).toEqual({ x: 2315, y: 1385, width: 470, height: 835 });
	});
});

describe('shiftCell', () => {
	it('', async () => {
		const canvas = cellCanvas([polaroid.info]);
		const shifted = shiftCell(canvas, polaroid.info);
		expect(shifted).toEqual({
			deviceName: 'Polaroid A600',
			server: 'http://127.0.0.1:3000/',
			width: 470,
			height: 835,
			x: 0,
			y: 0
		});
	});
});
