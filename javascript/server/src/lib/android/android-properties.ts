import type { ADB } from 'appium-adb';
import { derived, type Readable } from 'svelte/store';
import { transformMapAsync } from '../map/transform';

export interface AndroidProperties {
	model: string;
	manufacturer: string;
}

/**
 * Fetches important properties from the connected Android devices.
 */
export function androidProperties(
	devices: Readable<ReadonlyMap<string, ADB>>
): Readable<ReadonlyMap<string, AndroidProperties>> {
	return derived(
		devices,
		($devices, set) => {
			let invalidated = false;

			transformMapAsync($devices, async (adb) => {
				const [model, manufacturer] = await Promise.all([adb.getModel(), adb.getManufacturer()]);

				const properties: AndroidProperties = {
					model,
					manufacturer
				};
				return properties;
			}).then((map) => {
				if (!invalidated) {
					set(map);
				}
			});

			return () => {
				invalidated = true;
			};
		},
		new Map()
	);
}
