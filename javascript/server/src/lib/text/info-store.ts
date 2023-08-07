import { memo, type CellData, type CellInfo } from '@cell-wall/shared';
import { derived, type Readable } from 'svelte/store';
import { transformMap } from '../map/transform';
import { sortDevicesByPosition, sortDevicesBySize } from './sort';

function equalMaps<Key, Value>(a: ReadonlyMap<Key, Value>, b: ReadonlyMap<Key, Value>): boolean {
	if (a.size !== b.size) {
		return false;
	}

	return Array.from(a.entries()).every(([key, aValue]) => aValue === b.get(key));
}

/**
 * Re-derive cell info map with all cell serial numbers.
 * Only update if info has changed identity.
 */
function deriveCellInfo(
	cellData: Readable<ReadonlyMap<string, CellData>>
): Readable<ReadonlyMap<string, CellInfo | undefined>> {
	let lastMap: ReadonlyMap<string, CellInfo | undefined> = new Map();
	return derived(cellData, (devices) => {
		const newMap = transformMap(devices, (device) => device.info);
		if (!equalMaps(newMap, lastMap)) {
			lastMap = newMap;
			return newMap;
		} else {
			return lastMap;
		}
	});
}

function _deriveSortedInfo(cellData: Readable<ReadonlyMap<string, CellData>>) {
	const cellInfo = deriveCellInfo(cellData);

	return {
		leftToRight: derived(cellInfo, sortDevicesByPosition),
		biggestToSmallest: derived(cellInfo, sortDevicesBySize)
	};
}

export const deriveSortedInfo = memo(_deriveSortedInfo);
