import type { CellState } from '@cell-wall/shared';
import { describe, expect, it } from '@jest/globals';
import { get, writable } from 'svelte/store';
import { filterState } from '../filter-state';

describe('filterState', () => {
	it('filters WEB', () => {
		const state = writable<CellState>({ type: 'TEXT', payload: 'Hello' });
		const filtered = filterState('WEB', state);

		expect(get(filtered)).toBeUndefined();

		state.set({ type: 'WEB', payload: 'https://example.com' });
		expect(get(filtered)).toEqual({ type: 'WEB', payload: 'https://example.com' });
	});

	it('preserves last valid state', () => {
		const state = writable<CellState>({ type: 'WEB', payload: 'https://example.com' });
		const filtered = filterState('TEXT', state);

		expect(get(filtered)).toBeUndefined();

		state.set({ type: 'TEXT', payload: 'Hello' });
		expect(get(filtered)).toEqual({ type: 'TEXT', payload: 'Hello' });

		state.set({ type: 'BLANK' });
		expect(get(filtered)).toEqual({ type: 'TEXT', payload: 'Hello' });

		state.set({ type: 'IMAGE', payload: new ArrayBuffer(8) });
		expect(get(filtered)).toEqual({ type: 'TEXT', payload: 'Hello' });
	});
});
