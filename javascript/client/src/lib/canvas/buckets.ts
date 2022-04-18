import {
	validRect,
	validRectWithPos,
	type CellData,
	type CellInfo,
	type Rectangle,
	type RectangleWithPosition
} from '@cell-wall/shared';

export function splitToBuckets(devices: ReadonlyMap<string, CellData>): {
	rectWithPos: readonly (CellInfo & RectangleWithPosition)[];
	rect: readonly (CellInfo & Rectangle)[];
	rest: readonly CellInfo[];
} {
	const rectWithPos: (CellInfo & RectangleWithPosition)[] = [];
	const rect: (CellInfo & Rectangle)[] = [];
	const rest: CellInfo[] = [];

	for (const [serial, { info }] of devices) {
		if (!info) {
			rest.push({ serial });
			continue;
		}

		if (validRectWithPos(info)) {
			rectWithPos.push(info);
		} else if (validRect(info)) {
			rect.push(info);
		} else {
			rest.push(info);
		}
	}

	return { rectWithPos, rect, rest };
}
