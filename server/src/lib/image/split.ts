import Jimp from 'jimp';
import { cellCanvas, shiftCell } from '../cells/canvas.js';
import { transformMapAsync } from '../map/transform.js';
import { crop, resize, ResizeOptions } from './manipulate.js';
import type { RectangleWithPosition } from './rect.js';

export async function splitImage(
	image: Jimp,
	cells: ReadonlyMap<string, RectangleWithPosition>,
	options: ResizeOptions = {}
) {
	const canvas = cellCanvas(cells.values());
	await resize(image, canvas, options);

	return await transformMapAsync(cells, async (info) => {
		const copy = await Jimp.create(image);
		const shifted = shiftCell(canvas, info);
		return {
			info: shifted,
			img: await crop(copy, shifted)
		};
	});
}
