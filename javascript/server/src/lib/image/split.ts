import type { RectangleWithPosition } from '@cell-wall/shared';
import { cellCanvas, shiftCell } from '@cell-wall/shared';
import Jimp from 'jimp';
import { transformMapAsync } from '../map/transform';
import { crop, resize, type ResizeOptions } from './manipulate';

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
