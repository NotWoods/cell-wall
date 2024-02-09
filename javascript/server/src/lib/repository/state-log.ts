import type { CellData } from '@cell-wall/shared';
import { derived, type Readable } from 'svelte/store';
import type { AndroidProperties } from '@cell-wall/android-device-manager';
import { transformMap } from '@notwoods/webish';

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
