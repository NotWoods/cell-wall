import { describe, expect, it } from '@jest/globals';
import { toUri } from '../state';

describe('toUri', () => {
	it('handles WEB state', () => {
		const base = 'http://raspberrypi.local:3000/';
		expect(toUri({ type: 'WEB', payload: '/page/text' }, base).href).toBe(
			'http://raspberrypi.local:3000/page/text'
		);
	});
});
