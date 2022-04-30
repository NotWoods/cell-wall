import type { ADB } from 'appium-adb';
import { derived, type Readable } from 'svelte/store';
import { transformMapAsync } from '../map/transform';
import { setWhenDone } from '../store/promise';
import type { Serial } from './opaque';

export interface AndroidProperties {
	model: string;
	manufacturer: string;
}

/**
 * Fetches important properties from the connected Android devices.
 */
export function androidProperties(
	devices: Readable<ReadonlyMap<Serial, ADB>>
): Readable<ReadonlyMap<Serial, AndroidProperties>> {
	return derived(
		devices,
		($devices, set) =>
			setWhenDone(
				transformMapAsync($devices, async (adb): Promise<AndroidProperties> => {
					const [model, manufacturer] = await Promise.all([adb.getModel(), adb.getManufacturer()]);
					return { model, manufacturer };
				}),
				set
			),
		new Map()
	);
}
