import type { Device } from 'appium-adb';
import { ADB } from 'appium-adb';
import { writable, type Readable } from 'svelte/store';
import type { Serial } from './opaque.js';

export interface DevicesStore extends Readable<ReadonlyMap<Serial, ADB>> {
	/**
	 * Poll for the current list of connected ADB devices.
	 */
	refresh(): Promise<void>;
}

function noDeviceError(err: unknown): err is Error {
	return err instanceof Error && err.message.includes('Could not find a connected Android device');
}

/**
 * Store containing connected ADB devices.
 * ADB doesn't notify us when devices change, so the list needs to be manually refreshed.
 */
export function adbDevicesStore(): DevicesStore {
	const devicesStore = writable<ReadonlyMap<Serial, ADB>>(new Map());
	// appium-adb interface that's not attached to a specific device
	const adbGlobalReady = ADB.createADB();

	return {
		subscribe: devicesStore.subscribe,
		async refresh() {
			const adb = await adbGlobalReady;

			let devices: readonly Device[];
			try {
				devices = await adb.getDevicesWithRetry();
			} catch (err) {
				if (noDeviceError(err)) {
					devices = [];
				} else {
					throw err;
				}
			}

			const adbDevices = new Map(
				devices.map((device) => {
					const clone = adb.clone();
					clone.setDevice(device);
					return [device.udid as Serial, clone];
				})
			);
			devicesStore.set(adbDevices);
		}
	};
}
