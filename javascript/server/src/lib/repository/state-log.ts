import type { CellData } from '@cell-wall/shared';
import { derived, Readable } from 'svelte/store';
import type { AndroidProperties } from '../android/android-properties';
import { transformMap } from '../map/transform';

export function logState(
	cellData: Readable<ReadonlyMap<string, CellData>>,
	deviceManager: {
		properties: Readable<ReadonlyMap<string, AndroidProperties>>;
		powered: Readable<ReadonlySet<string>>;
	}
) {
	cellData.subscribe(($cellData) => console.info('CellData', $cellData));

	derived([deviceManager.properties, deviceManager.powered], ([$properties, $powered]) =>
		transformMap($properties, (properties, serial) => ({
			...properties,
			power: $powered.has(serial)
		}))
	).subscribe(($properties) => console.info('AndroidProperties', $properties));
}
