import type { CellInfo } from '@cell-wall/shared';
import { sortDevicesByPosition, sortDevicesBySize } from './sort';

/**
 * Distribute text among each cell.
 * @returns Map of cell IDs to lines of text to display.
 */
export function distributeText(
	devices: ReadonlyMap<string, CellInfo | undefined>,
	lines: readonly string[]
): ReadonlyMap<string, readonly string[]> {
	const deviceIds = sortDevicesByPosition(devices);
	const biggestToSmallest = sortDevicesBySize(devices);

	const smallestBucketSize = Math.floor(lines.length / deviceIds.length);
	let remainderBucketSize = lines.length % deviceIds.length;
	const bucketSizes = new Map<string, number>(
		biggestToSmallest.map((id) => [id, smallestBucketSize])
	);
	for (const [id, size] of bucketSizes.entries()) {
		bucketSizes.set(id, size + 1);
		remainderBucketSize--;
		if (remainderBucketSize <= 0) {
			break;
		}
	}

	// Put text into buckets for each device
	const deviceToText = new Map<string, string[]>();
	let i = 0;
	for (const id of deviceIds) {
		const bucketSize = bucketSizes.get(id) ?? 0;
		const text = lines.slice(i, i + bucketSize);
		i += bucketSize;
		deviceToText.set(id, text);
	}

	return deviceToText;
}
