import Jimp from 'jimp';
import type { Rectangle, RectangleWithPosition } from './rect';

export interface ResizeOptions {
	horizontalAlign?: string | null;
	verticalAlign?: string | null;
	resize?: string | null;
}

export const ALIGN_QUERY: Record<string, number> = {
	left: Jimp.HORIZONTAL_ALIGN_LEFT,
	right: Jimp.HORIZONTAL_ALIGN_RIGHT,
	center: Jimp.HORIZONTAL_ALIGN_CENTER,
	top: Jimp.VERTICAL_ALIGN_TOP,
	bottom: Jimp.VERTICAL_ALIGN_BOTTOM,
	middle: Jimp.VERTICAL_ALIGN_MIDDLE
};

export const RESIZE = new Set([
	Jimp.RESIZE_NEAREST_NEIGHBOR,
	Jimp.RESIZE_BILINEAR,
	Jimp.RESIZE_BICUBIC,
	Jimp.RESIZE_HERMITE,
	Jimp.RESIZE_BEZIER
]);

type Item<T> = T extends ReadonlySet<infer I> ? I : never;

function has<T>(set: ReadonlySet<T>, item: unknown): item is Item<T> {
	return set.has(item as any);
}

export function parseResizeOptions(query: ResizeOptions = {}): {
	alignBits: number;
	resizeMode: Item<typeof RESIZE> | undefined;
} {
	const horizontalFlag = ALIGN_QUERY[query.horizontalAlign!] || 0;
	const verticalFlag = ALIGN_QUERY[query.verticalAlign!] || 0;
	const resize = has(RESIZE, query.resize) ? query.resize : undefined;

	return {
		alignBits: horizontalFlag | verticalFlag,
		resizeMode: resize
	};
}

export function resize(
	image: Jimp,
	{ width, height }: Rectangle,
	query: ResizeOptions = {}
): Promise<Jimp> {
	const { alignBits, resizeMode } = parseResizeOptions(query);
	return new Promise<Jimp>((resolve, reject) =>
		image.cover(width, height, alignBits, resizeMode, (err, value) => {
			if (err) reject(err);
			else resolve(value);
		})
	);
}

export function crop(image: Jimp, cell: RectangleWithPosition): Promise<Jimp> {
	return new Promise<Jimp>((resolve, reject) =>
		image.crop(cell.x, cell.y, cell.width, cell.height, (err, value) => {
			if (err) reject(err);
			else resolve(value);
		})
	);
}
