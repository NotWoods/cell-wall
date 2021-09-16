import type { Rectangle, RectangleWithPosition } from '../image/rect.js';

const AXIS_TO_POS: ReadonlyMap<
	keyof Rectangle,
	Exclude<keyof RectangleWithPosition, keyof Rectangle>
> = new Map().set('width', 'x').set('height', 'y');

export function cellCanvas(cells: Iterable<RectangleWithPosition>): RectangleWithPosition {
	const canvas: RectangleWithPosition = { x: Infinity, y: Infinity, width: 0, height: 0 };

	for (const info of cells) {
		for (const [axis, pos] of AXIS_TO_POS) {
			const value = info[pos] + info[axis];
			if (!Number.isNaN(value)) {
				canvas[pos] = Math.min(canvas[pos], info[pos]);
				canvas[axis] = Math.max(canvas[axis], info[pos] + info[axis]);
			}
		}
	}

	canvas.width = canvas.width - canvas.x;
	canvas.height = canvas.height - canvas.y;
	return canvas;
}

export function shiftCell<T extends RectangleWithPosition>(
	canvas: RectangleWithPosition,
	cell: T
): T {
	const copy = { ...cell };
	copy.x = cell.x - canvas.x;
	copy.y = cell.y - canvas.y;
	return copy;
}
