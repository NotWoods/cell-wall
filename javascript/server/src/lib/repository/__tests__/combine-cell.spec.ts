import type { CellInfo, CellState } from '@cell-wall/shared';
import { describe, expect, it, jest } from '@jest/globals';
import type ADB from 'appium-adb';
import { get, writable } from 'svelte/store';
import type { DeviceMap } from '../../android/device-manager';
import { deriveCellData } from '../combine-cell';
import type { WebSocketInfo } from '../socket-store';

function createStores() {
	const info = writable(new Map<string, CellInfo>());
	const state = writable(new Map<string, CellState>());
	const devices = writable<DeviceMap>(new Map());
	const webSockets = writable(new Map<string, WebSocketInfo>());
	return { info, state, devices, webSockets };
}

function mockDevice(model: string, manufacturer: string) {
	return {
		adb: jest.fn() as unknown as ADB,
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
			connection: 'android',
			info: {
				serial: 'DEVICEA',
				deviceName: 'ManufacturerA ModelA'
			}
		});
		expect(derived.get('DEVICEB')).toEqual({
			connection: 'android',
			info: {
				serial: 'DEVICEB',
				deviceName: 'ManuB ModelB'
			}
		});
		expect(derived.get('DEVICEC')).toEqual({
			connection: 'android',
			info: {
				serial: 'DEVICEC',
				deviceName: 'ManuC ModelC'
			}
		});
		expect(derived.get('DEVICED')).toEqual({
			connection: 'android',
			info: {
				serial: 'DEVICED',
				deviceName: 'OnePlus One',
				width: 470,
				height: 835
			}
		});
	});
});
