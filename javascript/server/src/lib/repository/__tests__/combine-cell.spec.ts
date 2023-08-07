import { blankState, type CellInfo, type CellState } from '@cell-wall/shared';
import { describe, expect, it } from '@jest/globals';
import { get, writable } from 'svelte/store';
import type { AndroidProperties } from '../../android/android-properties';
import { deriveCellData } from '../combine-cell';
import type { WebSocketInfo } from '../socket-store';

function createStores() {
	const database = writable(new Map<string, CellInfo>());
	const state = writable(new Map<string, CellState>());
	const androidProperties = writable(new Map<string, AndroidProperties>());
	const webSockets = writable(new Map<string, WebSocketInfo>());
	return { database, state, androidProperties, webSockets };
}

function mockDevice(model: string, manufacturer: string) {
	return {
		model,
		manufacturer
	};
}

describe('deriveCellData', () => {
	it('works with blank data', async () => {
		const stores = createStores();
		const derived = get(deriveCellData(stores));
		expect(derived.size).toBe(0);
	});

	it('initializes from device map', async () => {
		const stores = createStores();
		const derivedStore = deriveCellData(stores);

		stores.androidProperties.set(
			new Map()
				.set('DEVICEA', mockDevice('ModelA', 'ManufacturerA'))
				.set('DEVICEB', mockDevice('ManuB ModelB', 'ManuB'))
				.set('DEVICEC', mockDevice('ManuC ModelC', 'Android'))
				.set('DEVICED', mockDevice('A0001', 'OnePlus'))
		);

		const derived = get(derivedStore);
		expect(derived.size).toBe(4);
		expect(derived.get('DEVICEA')).toEqual({
			connection: ['android'],
			state: blankState,
			info: {
				serial: 'DEVICEA',
				deviceName: 'ManufacturerA ModelA'
			}
		});
		expect(derived.get('DEVICEB')).toEqual({
			connection: ['android'],
			state: blankState,
			info: {
				serial: 'DEVICEB',
				deviceName: 'ManuB ModelB'
			}
		});
		expect(derived.get('DEVICEC')).toEqual({
			connection: ['android'],
			state: blankState,
			info: {
				serial: 'DEVICEC',
				deviceName: 'ManuC ModelC'
			}
		});
		expect(derived.get('DEVICED')).toEqual({
			connection: ['android'],
			state: blankState,
			info: {
				serial: 'DEVICED',
				deviceName: 'OnePlus One',
				width: 470,
				height: 835
			}
		});
	});
});
