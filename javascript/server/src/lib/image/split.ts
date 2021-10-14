import Jimp from 'jimp';
import { cellCanvas, shiftCell } from '../cells/canvas';
import { transformMapAsync } from '../map/transform';
import { crop, resize, ResizeOptions } from './manipulate';
import type { RectangleWithPosition } from './rect';

interface SplitImageResult {
	info: RectangleWithPosition;
	img: Jimp;
}

export async function splitImage(
	image: Jimp,
	cells: ReadonlyMap<string, RectangleWithPosition>,
	options: ResizeOptions = {}
): Promise<Map<string, SplitImageResult>> {
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
