import type { Device } from 'appium-adb';
import { ADB } from 'appium-adb';
import { writable, type Readable } from 'svelte/store';

export interface DevicesStore extends Readable<ReadonlyMap<string, ADB>> {
	/**
	 * Poll for the current list of connected ADB devices.
	 */
	refresh(): Promise<void>;
}

function noDeviceError(err: unknown): err is Error {
	return err instanceof Error && err.message.includes('Could not find a connected Android device');
}

/**
 * Synchronous alternative to `ADB.createADB` that copies properties from another ADB object
 * to avoid the asynchronous initialization work.
 */
function createChildAdb(parent: ADB) {
	const adbChild = new ADB();
	// Set sdkRoot https://github.com/appium/appium-adb/blob/master/lib/adb.js#L57
	adbChild.sdkRoot = parent.sdkRoot;
	// Set executable https://github.com/appium/appium-adb/blob/master/lib/adb.js#L58
	adbChild.executable.path = parent.executable.path;
	return adbChild;
}

/**
 * Store containing connected ADB devices.
 * ADB doesn't notify us when devices change, so the list needs to be manually refreshed.
 */
export function adbDevicesStore(): DevicesStore {
	const devicesStore = writable<ReadonlyMap<string, ADB>>(new Map());
	// appium-adb interface that's not attached to a specific device
	const adbGlobalReady = ADB.createADB({
		allowOfflineDevices: process.env['NODE_ENV'] !== 'production'
	});

	return {
		subscribe: devicesStore.subscribe,
		async refresh() {
			const adbGlobal = await adbGlobalReady;
			adbGlobal.createSubProcess;

			let devices: readonly Device[];
			try {
				devices = await adbGlobal.getDevicesWithRetry();
			} catch (err) {
				if (!noDeviceError(err)) {
					devices = [];
				} else {
					throw err;
				}
			}

			const adbDevices = new Map(
				devices.map((device) => {
					// Copy initialized properties from the parent ADB object
					const adbChild = createChildAdb(adbGlobal);
					adbChild.setDevice(device);

					return [device.udid, adbChild];
				})
			);
			devicesStore.set(adbDevices);
		}
	};
}
