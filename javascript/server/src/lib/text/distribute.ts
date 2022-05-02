import type { CellInfo, Position, Rectangle } from '@cell-wall/shared';

function hasKeys<T>(obj: Partial<T> | undefined, keys: readonly (keyof T)[]): obj is T {
	if (obj == undefined) return false;
	return keys.every((key) => obj[key] !== undefined);
}

function scorePosition(info: Position): number {
	return info.x * -1 + info.y * -500;
}

function scoreSize(info: Rectangle): number {
	return info.width * 100 + info.height * 1;
}

function asPosition(info: CellInfo | undefined): Position | undefined {
	return hasKeys<Position>(info, ['x', 'y']) ? info : undefined;
}

function asRectangle(info: CellInfo | undefined): Rectangle | undefined {
	return hasKeys<Rectangle>(info, ['width', 'height']) ? info : undefined;
}

function compareValues<T>(
	asValue: (info: CellInfo | undefined) => T | undefined,
	compareFn: (value: T) => number
) {
	type Entry = readonly [unknown, CellInfo | undefined];
	return ([, aInfo]: Entry, [, bInfo]: Entry): number => {
		const a = asValue(aInfo);
		const b = asValue(bInfo);
		if (a != undefined && b != undefined) {
			return compareFn(b) - compareFn(a);
		} else if (a) {
			// Sort a before b
			return -1;
		} else if (b) {
			// Sort b before a
			return 1;
		} else {
			return 0;
		}
	};
}

function sortDevicesByPosition(devices: ReadonlyMap<string, CellInfo | undefined>) {
	return (
		Array.from(devices)
			// Sort devices by screen width
			.sort(compareValues(asPosition, scorePosition))
			// Only return keys
			.map(([id]) => id)
	);
}

function sortDevicesBySize(devices: ReadonlyMap<string, CellInfo | undefined>) {
	return (
		Array.from(devices)
			// Sort devices by screen width
			.sort(compareValues(asRectangle, scoreSize))
			// Only return keys
			.map(([id]) => id)
	);
}

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
