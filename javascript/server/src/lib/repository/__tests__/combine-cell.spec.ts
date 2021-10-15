import { describe, it, expect, jest } from '@jest/globals';
import type ADB from 'appium-adb';
import { get, writable } from 'svelte/store';
import type { DeviceMap } from '../../android/device-manager';
import type { CellState } from '../../cells';
import { deriveCellInfo } from '../combine-cell';
import type { Cell } from '../database';

function createStores() {
	const info = writable(new Map<string, Cell>());
	const state = writable(new Map<string, CellState>());
	const devices = writable<DeviceMap>(new Map());
	return { info, state, devices };
}

function mockDevice(model: string, manufacturer: string) {
	return {
		adb: jest.fn() as unknown as ADB,
		model,
		manufacturer
	};
}

describe('deriveCellInfo', () => {
	it('works with blank data', async () => {
		const stores = createStores();
		const derived = get(deriveCellInfo(stores, stores));
		expect(derived.size).toBe(0);
	});

	it('initializes from device map', async () => {
		const stores = createStores();
		const derivedStore = deriveCellInfo(stores, stores);

		stores.devices.set(
			new Map()
				.set('DEVICEA', mockDevice('ModelA', 'ManufacturerA'))
				.set('DEVICEB', mockDevice('ManuB ModelB', 'ManuB'))
				.set('DEVICEC', mockDevice('ManuC ModelC', 'Android'))
		);

		const derived = get(derivedStore);
		expect(derived.size).toBe(3);
		expect(derived.get('DEVICEA')).toEqual({
			serial: 'DEVICEA',
			connected: true,
			info: {
				serial: 'DEVICEA',
				deviceName: 'ManufacturerA ModelA'
			}
		});
		expect(derived.get('DEVICEB')).toEqual({
			serial: 'DEVICEB',
			connected: true,
			info: {
				serial: 'DEVICEB',
				deviceName: 'ManuB ModelB'
			}
		});
		expect(derived.get('DEVICEC')).toEqual({
			serial: 'DEVICEC',
			connected: true,
			info: {
				serial: 'DEVICEC',
				deviceName: 'ManuC ModelC'
			}
		});
	});
});
