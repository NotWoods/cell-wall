import { describe, expect, it } from '@jest/globals';
import { CellStateType, toUri } from '../state';

describe('toUri', () => {
	it('handles WEB state', () => {
		const base = 'http://raspberrypi.local:3000/';
		expect(toUri({ type: CellStateType.WEB, url: '/page/text' }, base)).toBe(
			'http://raspberrypi.local:3000/page/text'
		);
	});
});
