import type ADB from 'appium-adb';
import { get, writable, type Readable, type Updater, type Writable } from 'svelte/store';
import { findChangeSet } from '../map/changes';
import { allSettledMap } from '../map/transform';
import { setWhenDone } from '../store/promise';
import { getWakefulness } from './adb-actions';
import type { Serial } from './opaque';

const KEYCODE_UNKNOWN = 0;
const KEYCODE_POWER = 26;

export interface AndroidPoweredStore extends Writable<ReadonlySet<Serial>> {
	/**
	 * Set new powered devices and inform subscribers.
	 * @param value to set
	 * @returns Promise that resolves after power states are changed.
	 */
	set(
		this: void,
		value: ReadonlySet<Serial>
	): Promise<ReadonlyMap<Serial, PromiseSettledResult<void>>>;
	/**
	 * Update new powered devices using callback and inform subscribers.
	 * @param updater callback
	 * @returns Promise that resolves after power states are changed.
	 */
	update(
		this: void,
		updater: Updater<ReadonlySet<Serial>>
	): Promise<ReadonlyMap<Serial, PromiseSettledResult<void>>>;
	/**
	 * Poll for the current power states of connected ADB devices.
	 */
	refresh(): Promise<void>;
}

/**
 * Helper class to manage power state of ADB-connected devices.
 * Power isn't reported by events so we need to poll and track the last set value.
 */
export function androidPowered(devices: Readable<ReadonlyMap<Serial, ADB>>): AndroidPoweredStore {
	async function refreshDevicePowerStates($devices: ReadonlyMap<Serial, ADB>) {
		const powered = new Set<Serial>();

		await Promise.all(
			Array.from($devices).map(async ([udid, adb]) => {
				const wakefulness = await getWakefulness(adb);
				if (wakefulness === 'Awake') {
					powered.add(udid);
				}
			})
		);

		return powered;
	}

	// Set of powered on devices (by udid).
	const poweredOn = writable<ReadonlySet<Serial>>(new Set(), (set) => {
		// Update the power state when the devices change.
		return devices.subscribe(($devices) => setWhenDone(refreshDevicePowerStates($devices), set));
	});

	/**
	 * Match the device's power setting to the given `on` value.
	 */
	async function setPowerForDevice(adb: ADB | undefined, on: boolean) {
		if (!adb) return;

		const wakefulness = await getWakefulness(adb);
		if (wakefulness === 'Awake') {
			if (on) {
				// Device is already on, so just tap an "unknown" button to make sure the screen is bright.
				await adb.keyevent(KEYCODE_UNKNOWN);
			} else {
				// Tap the power button to switch the device off
				await adb.keyevent(KEYCODE_POWER);
			}
		} else {
			if (on) {
				// Device is asleep, so wake it up
				await adb.cycleWakeUp();
			} else {
				// Device is off and we want it to be off, do nothing
			}
		}
	}

	/**
	 * Update the power state of devices based on new values being set into the store.
	 */
	async function updateStore(
		updater: Updater<ReadonlySet<Serial>>
	): Promise<ReadonlyMap<Serial, PromiseSettledResult<void>>> {
		const promises = new Map<Serial, Promise<void>>();
		poweredOn.update((oldSet) => {
			const newSet = updater(oldSet);
			const $devices = get(devices);
			const { added, removed, same } = findChangeSet(oldSet, newSet);

			function updatePower(udid: Serial, on: boolean) {
				const device = $devices.get(udid);
				if (device) {
					promises.set(udid, setPowerForDevice(device, on));
				}
			}

			added.forEach((udid) => updatePower(udid, true));
			same.forEach((udid) => updatePower(udid, true));
			removed.forEach((udid) => updatePower(udid, false));

			return newSet;
		});
		return allSettledMap(promises, (promise) => promise);
	}

	return {
		subscribe: poweredOn.subscribe,
		update: updateStore,
		set(newSet) {
			return updateStore(() => newSet);
		},
		async refresh() {
			poweredOn.set(await refreshDevicePowerStates(get(devices)));
		}
	};
}
