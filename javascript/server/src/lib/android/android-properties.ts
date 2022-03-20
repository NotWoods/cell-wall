import type { ADB } from 'appium-adb';
import { derived, type Readable } from 'svelte/store';

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

			Promise.all(
				Array.from($devices).map(async ([udid, adb]) => {
					const [model, manufacturer] = await Promise.all([adb.getModel(), adb.getManufacturer()]);

					const properties: AndroidProperties = {
						model,
						manufacturer
					};

					return [udid, properties] as const;
				})
			).then((entries) => {
				if (!invalidated) {
					set(new Map(entries));
				}
			});

			return () => {
				invalidated = true;
			};
		},
		new Map()
	);
}
