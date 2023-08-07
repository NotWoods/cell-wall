import { textState } from '@cell-wall/shared';
import { jest, describe, expect, it } from '@jest/globals';
import type { CellStateStore } from '../../cells';
import { asDelay, setStatesWithDelay } from '../delay';

describe('asDelay', () => {
	it('parses ms style values', () => {
		expect(asDelay('100ms')).toBe(100);
		expect(asDelay('245')).toBe(245);
		expect(asDelay('0ms')).toBe(0);
	});

	it('parses style values', () => {
		expect(asDelay('2s')).toBe(2000);
		expect(asDelay('0s')).toBe(0);
	});

	it('ignores empty strings', () => {
		expect(asDelay('')).toBeUndefined();
	});

	it('throws on invalid values', () => {
		expect(() => asDelay('foo')).toThrowError(/Invalid delay/);
	});
});

describe('setStatesWithDelay', () => {
	it('text states with no delay', async () => {
		const store = { setState: jest.fn(), setStates: jest.fn() };

		await setStatesWithDelay(
			store as unknown as CellStateStore,
			[textState('Text1'), textState('Text2'), textState('Text3')],
			['1', '2', '3'],
			0
		);

		expect(store.setStates).toBeCalledWith(
			new Map()
				.set('1', textState('Text1'))
				.set('2', textState('Text2'))
				.set('3', textState('Text3'))
		);
	});

	it('text states no delay and fewer IDs', async () => {
		const store = { setState: jest.fn(), setStates: jest.fn() };

		await setStatesWithDelay(
			store as unknown as CellStateStore,
			[textState('Text1'), textState('Text2'), textState('Text3'), textState('Text4')],
			['1', '2'],
			0
		);

		expect(store.setStates).toBeCalledWith(
			new Map().set('1', textState('Text3')).set('2', textState('Text4'))
		);
	});

	it('text states with delay', async () => {
		const store = { setState: jest.fn(), setStates: jest.fn() };

		await setStatesWithDelay(
			store as unknown as CellStateStore,
			[textState('Text1'), textState('Text2'), textState('Text3')],
			['1', '2', '3'],
			100
		);

		expect(store.setState).toBeCalledWith('1', textState('Text1'));
		expect(store.setState).toBeCalledWith('2', textState('Text2'));
		expect(store.setState).toBeCalledWith('3', textState('Text3'));
	});

	it('text states with delay and fewer IDs', async () => {
		const store = { setState: jest.fn(), setStates: jest.fn() };

		await setStatesWithDelay(
			store as unknown as CellStateStore,
			[textState('Text1'), textState('Text2'), textState('Text3'), textState('Text4')],
			['1', '2'],
			100
		);

		expect(store.setState).toBeCalledWith('1', textState('Text1'));
		expect(store.setState).toBeCalledWith('2', textState('Text2'));
		expect(store.setState).toBeCalledWith('1', textState('Text3'));
		expect(store.setState).toBeCalledWith('2', textState('Text4'));
	});
});
