import type { CellInfo, CellState } from '@cell-wall/cell-state';
import { describe, expect, it, jest } from '@jest/globals';
import type ADB from 'appium-adb';
import { get, writable } from 'svelte/store';
import type { DeviceMap } from '../../android/device-manager';
import { deriveCellInfo } from '../combine-cell';

function createStores() {
	const info = writable(new Map<string, CellInfo>());
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
		const derived = get(deriveCellInfo(stores));
		expect(derived.size).toBe(0);
	});

	it('initializes from device map', async () => {
		const stores = createStores();
		const derivedStore = deriveCellInfo(stores);

		stores.devices.set(
			new Map()
				.set('DEVICEA', mockDevice('ModelA', 'ManufacturerA'))
				.set('DEVICEB', mockDevice('ManuB ModelB', 'ManuB'))
				.set('DEVICEC', mockDevice('ManuC ModelC', 'Android'))
				.set('DEVICED', mockDevice('A0001', 'OnePlus'))
		);

		const derived = get(derivedStore);
		expect(derived.size).toBe(4);
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
		expect(derived.get('DEVICED')).toEqual({
			serial: 'DEVICED',
			connected: true,
			info: {
				serial: 'DEVICED',
				deviceName: 'OnePlus One',
				width: 470,
				height: 835
			}
		});
	});
});
