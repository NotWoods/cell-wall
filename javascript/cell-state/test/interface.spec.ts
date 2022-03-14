import { describe, expect, it } from '@jest/globals';
import { filterState } from '../src/interface';

describe('filterState', () => {
	it('filters WEB', () => {
		expect(filterState('WEB', { type: 'TEXT', payload: 'Hello' })).toBeUndefined();
		expect(filterState('WEB', { type: 'WEB', payload: 'https://example.com' })).toEqual({
			type: 'WEB',
			payload: 'https://example.com'
		});
	});
});
